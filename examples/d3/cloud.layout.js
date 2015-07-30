/* jshint -W016, -W004, -W117, -W058, -W055, -W018, -W030 */

// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

(function (t) {

    t.cloud = function cloud() {
        var size = [256, 256],
            text = cloudText,
            font = cloudFont,
            fontSize = cloudFontSize,
            fontStyle = cloudFontNormal,
            fontWeight = cloudFontNormal,
            rotate = cloudRotate,
            padding = cloudPadding,
            spiral = archimedeanSpiral,
            words = [],
            timeInterval = Infinity,
            event = d3.dispatch('word', 'end'),
            timer = null,
            random = Math.random,
            cloud = {};

        cloud.start = function () {

            var board = zeroArray((size[0] >> 5) * size[1]),
                bounds = null,
                n = words.length,
                i = -1,
                tags = [],
                data = prepWordTags();

            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(step, 0);
            step();

            return cloud;

            function step() {
                var start = +new Date;
                while (+new Date - start < timeInterval && ++i < n && timer) {
                    var d = data[i];
                    d.x = (size[0] * (random() + 0.5)) >> 1;
                    d.y = (size[1] * (random() + 0.5)) >> 1;
                    cloudSprite(d, data, i);
                    if (d.hasText && place(board, d, bounds)) {
                        tags.push(d);
                        event.word(d);
                        if (bounds) {
                            cloudBounds(bounds, d);
                        }
                        else {
                            bounds = [
                                {x: d.x + d.x0, y: d.y + d.y0},
                                {x: d.x + d.x1, y: d.y + d.y1}];

                        }
                        // Temporary hack
                        d.x -= size[0] >> 1;
                        d.y -= size[1] >> 1;
                    }
                }
                if (i >= n) {
                    cloud.stop();
                    event.end(tags, bounds);
                }
            }
        };

        cloud.stop = function () {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            return cloud;
        };

        function prepWordTags() {
            return words.map(function (d, i) {
                return {
                    text: text.call(this, d, i),
                    font: font.call(this, d, i),
                    style: fontStyle.call(this, d, i),
                    weight: fontWeight.call(this, d, i),
                    rotate: rotate.call(this, d, i),
                    size: ~~fontSize.call(this, d, i),
                    padding: cloudPadding.call(this, d, i)
                };
            }).sort(function (a, b) {
                return b.size - a.size;
            });
        }

        function place(board, tag, bounds) {
            var perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}],
                startX = tag.x,
                startY = tag.y,
                maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
                s = spiral(size),
                dt = random() < 0.5 ? 1 : -1,
                t = -dt,
                dxdy,
                dx,
                dy;
            while (true) {

                dxdy = s(t += dt);
                dx = ~~dxdy[0];
                dy = ~~dxdy[1];

                if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) {
                    break;
                }

                tag.x = startX + dx;
                tag.y = startY + dy;

                var bIsOutside = isTagStickingOut(tag, size);

                if (bIsOutside) {
                    continue;
                }

                // TODO only check for collisions within current bounds.
                if (!bounds || !cloudCollide(tag, board, size[0])) {
                    if (!bounds || collideRects(tag, bounds)) {
                        var sprite = tag.sprite,
                            w = tag.width >> 5,
                            sw = size[0] >> 5,
                            lx = tag.x - (w << 4),
                            sx = lx & 0x7f,
                            msx = 32 - sx,
                            h = tag.y1 - tag.y0,
                            x = (tag.y + tag.y0) * sw + (lx >> 5),
                            last;
                        for (var j = 0; j < h; j++) {
                            last = 0;
                            for (var i = 0; i <= w; i++) {
                                board[x + i] |=
                                    (last << msx) |
                                    (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
                            }
                            x += sw;
                        }
                        delete tag.sprite;
                        return true;
                    }
                }
            }
            return false;
        }

        cloud.timeInterval = function (_) {
            return arguments.length ?
                (timeInterval = _ === null ? Infinity : _ , cloud) :
                timeInterval;
        };

        cloud.words = function (_) {
            if (arguments.length) {
                words = _;
                return cloud;
            } else {
                return words;
            }
        };

        cloud.size = function (_) {
            if (arguments.length) {
                size = [+_[0], +_[1]];
                return cloud;
            } else {
                return size;
            }
        };

        cloud.font = function (_) {
            return arguments.length ? (font = d3.functor(_), cloud) : font;
        };

        cloud.fontStyle = function (_) {
            return arguments.length ? (fontStyle = d3.functor(_), cloud) : fontStyle;
        };

        cloud.fontWeight = function (_) {
            return arguments.length ?
                (fontWeight = d3.functor(_), cloud) :
                fontWeight;
        };

        cloud.rotate = function (_) {
            return arguments.length ? (rotate = d3.functor(_), cloud) : rotate;
        };

        cloud.text = function (_) {
            return arguments.length ? (text = d3.functor(_), cloud) : text;
        };

        cloud.spiral = function (_) {
            return arguments.length ? (spiral = spirals[_] || _, cloud) : spiral;
        };

        cloud.fontSize = function (_) {
            return arguments.length ? (fontSize = d3.functor(_), cloud) : fontSize;
        };

        cloud.padding = function (_) {
            return arguments.length ? (padding = d3.functor(_), cloud) : padding;
        };

        cloud.random = function (_) {
            return arguments.length ? (random = _, cloud) : random;
        };

        cloud.prepWordTags = prepWordTags;

        return d3.rebind(cloud, event, 'on');
    };

    function cloudText(d) {
        return d.text;
    }

    function cloudFont() {
        return 'serif';
    }

    function cloudFontNormal() {
        return 'normal';
    }

    function cloudFontSize(d) {
        return Math.sqrt(d.value);
    }

    function cloudRotate() {
        return (~~(Math.random() * 6) - 3) * 30;
    }

    function cloudPadding() {
        return 1;
    }

    // Fetches a monochrome sprite bitmap for the specified text.
    // Load in batches for speed.
    function setupTag(tag, x, y, witdh, height) {
        tag.width = witdh;
        tag.height = height;
        tag.xoff = x;
        tag.yoff = y;
        tag.x1 = witdh >> 1;
        tag.y1 = height >> 1;
        tag.x0 = -tag.x1;
        tag.y0 = -tag.y1;
        tag.hasText = true;
    }

    function computeM(pixels, x, y, i, j) {
        var yOff = (y + j) * (cw << 5);
        var xOff = (x + i);
        var pixIdx = (yOff + xOff) << 2;
        var m;
        if (pixels[pixIdx]) {
            m = 1 << (31 - (i % 32));
        } else {
            m = 0;
        }
        return m;
    }

    function computeWH(d, w) {
        var h;
        h = d.size << 1;
        if (d.rotate) {
            var sr = Math.sin(d.rotate * cloudRadians),
                cr = Math.cos(d.rotate * cloudRadians),
                wcr = w * cr,
                wsr = w * sr,
                hcr = h * cr,
                hsr = h * sr;
            w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
            h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
        } else {
            w = (w + 0x1f) >> 5 << 5;
        }
        return {h: h, w: w};
    }

    function adjustSprite(sprite, d, m, i, j, w, w32) {
        var k = w32 * j + (i >> 5);
        if (d.padding) {
            if (j) {
                sprite[k - w32] |= m;
            }
            if (w - 1 > j) {
                sprite[k + w32] |= m;
            }

            m |= m << 1 | m >> 1;
        }
        sprite[k] |= m;
        return m;
    }

    function addTagSprite(d, x, y, pixels) {
        var w = d.width,
            w32 = w >> 5,
            h = d.y1 - d.y0,
            sprite, x, y;

        sprite = zeroArray(h * 32);
        x = d.xoff;
        y = d.yoff;
        var seen = 0,
            seenRow = -1;
        for (var j = 0; j < h; j++) {
            for (var i = 0; i < w; i++) {
                var m = computeM(pixels, x, y, i, j);
                seen |= adjustSprite(sprite, d, m, i, j, w, w32);
            }
            if (seen) {
                seenRow = j;
            }
            else {
                d.y0++;
                h--;
                j--;
                y++;
            }
        }
        d.y1 = d.y0 + seenRow;
        d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
    }

    function cloudSprite(d, data, di) {
        if (d.sprite) {
            return;
        }

        c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
        var x = 0,
            y = 0,
            maxh = 0,
            n = data.length;
        --di;
        while (++di < n) {
            d = data[di];
            c.save();
            c.font = ~~((d.size + 1) / ratio) +
                'px ' + d.font;
            var w = c.measureText(d.text + 'm').width * ratio, h;
            var wh = computeWH(d, w);
            h = wh.h;
            w = wh.w;

            if (h > maxh) {
                maxh = h;
            }
            if (x + w >= (cw << 5)) {
                x = 0;
                y += maxh;
                maxh = 0;
            }
            if (y + h >= ch) {
                break;
            }
            c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
            if (d.rotate) {
                c.rotate(d.rotate * cloudRadians);
            }
            c.fillText(d.text, 0, 0);
            c.restore();
            setupTag(d, x, y, w, h);
            x += w;
        }
        var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data;

        while (--di >= 0) {
            d = data[di];
            if (!d.hasText) {
                continue;
            }
            if (d.xoff === null) {
                return;
            }
            addTagSprite(d, x, y, pixels);
        }

    }

    function isTagStickingOut(tag, size) {
        var toTheLeft = tag.x + tag.x0 < 0;
        var toTheTop = tag.y + tag.y0 < 0;
        var toTheRight = tag.x + tag.x1 > size[0];
        var toTheBottom = tag.y + tag.y1 > size[1];
        if (toTheLeft) {
            return true;
        }
        if (toTheTop) {
            return true;
        }
        if (toTheRight) {
            return true;
        }
        if (toTheBottom) {
            return true;
        }
        return false;
    }

    // Use mask-based collision detection.
    function cloudCollide(tag, board, sw) {
        sw >>= 5;
        var sprite = tag.sprite,
            w = tag.width >> 5,
            lx = tag.x - (w << 4),
            sx = lx & 0x7f,
            msx = 32 - sx,
            h = tag.y1 - tag.y0,
            x = (tag.y + tag.y0) * sw + (lx >> 5),
            last;
        for (var j = 0; j < h; j++) {
            last = 0;
            for (var i = 0; i <= w; i++) {
                if (((last << msx) |
                    (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) &
                    board[x + i]) {
                    return true;
                }
            }
            x += sw;
        }
        return false;
    }

    function cloudBounds(bounds, d) {
        var b0 = bounds[0],
            b1 = bounds[1];
        if (d.x + d.x0 < b0.x) {
            b0.x = d.x + d.x0;
        }
        if (d.y + d.y0 < b0.y) {
            b0.y = d.y + d.y0;
        }
        if (d.x + d.x1 > b1.x) {
            b1.x = d.x + d.x1;
        }
        if (d.y + d.y1 > b1.y) {
            b1.y = d.y + d.y1;
        }
    }

    function collideRects(a, b) {
        return a.x + a.x1 > b[0].x &&
            a.x + a.x0 < b[1].x &&
            a.y + a.y1 > b[0].y &&
            a.y + a.y0 < b[1].y;
    }

    function archimedeanSpiral(size) {
        var e = size[0] / size[1];
        return function (t) {
            return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];
        };
    }

    function rectangularSpiral(size) {
        var dy = 4,
            dx = dy * size[0] / size[1],
            x = 0,
            y = 0;
        return function (t) {
            var sign = t < 0 ? -1 : 1;
            // See triangular numbers: T_n = n * (n + 1) / 2.
            switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
                case 0:
                    x += dx;
                    break;
                case 1:
                    y += dy;
                    break;
                case 2:
                    x -= dx;
                    break;
                default:
                    y -= dy;
                    break;
            }
            return [x, y];
        };
    }

    // TODO reuse arrays?
    function zeroArray(n) {
        var a = [],
            i = -1;
        while (++i < n) {
            a[i] = 0;
        }
        return a;
    }

    var cloudRadians = Math.PI / 180,
        cw = 1 << 11 >> 5,
        ch = 1 << 11,
        canvas,
        ratio = 1;
    if (typeof document !== 'undefined') {
        canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        ratio = Math.sqrt(
            canvas.getContext('2d')
                .getImageData(0, 0, 1, 1)
                .data
                .length >> 2);
        canvas.width = (cw << 5) / ratio;
        canvas.height = ch / ratio;
    } else {
        var Canvas = require('canvas');
        // Attempt to use node-canvas.
        canvas = new Canvas(cw << 5, ch);
    }
    var c = canvas.getContext('2d'),
        spirals = {
            archimedean: archimedeanSpiral,
            rectangular: rectangularSpiral
        };

    c.fillStyle = c.strokeStyle = 'red';
    c.textAlign = 'center';
    t.cloud.zeroArray = zeroArray;
    t.cloud.cloudBounds = cloudBounds;
    t.cloud.collideRects = collideRects;
    t.cloud.setupTag = setupTag;
    t.cloud.computeM = computeM;
    t.cloud.computeWH = computeWH;
    t.cloud.adjustSprite = adjustSprite;
    t.cloud.isTagStickingOut = isTagStickingOut;

}('undefined' === typeof exports ? d3.layout || (d3.layout = {}) : exports));
