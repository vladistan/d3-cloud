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
                var pixels;
                var di;
                var start = +new Date;
                while (+new Date - start < timeInterval && ++i < n && timer) {
                    var d = data[i];
                    d.x = (size[0] * (random() + 0.5)) >> 1;
                    d.y = (size[1] * (random() + 0.5)) >> 1;

                    if (!d.sprite) {
                        di = cloudSprite(data, i);
                        pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data;
                        updateTags(data, di, pixels);
                    }

                    if (d.hasText && place(board, d, bounds, needUpdate)) {
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

        function updateBoard(board, tag) {

            var sprite, last, x, v;

            v = setupValues(tag, size);

            x = v.x;
            sprite = tag.sprite;

            for (var j = 0; j < v.h; j++) {
                last = 0;
                for (var i = 0; i <= v.w; i++) {
                    var newBoardVal;
                    var lastMsx = last << (32 - v.sx);
                    if (i < v.w) {
                        newBoardVal = lastMsx | (last = sprite[j * v.w + i]) >>> v.sx;
                    } else {
                        newBoardVal = lastMsx;
                    }
                    board[x + i] |= newBoardVal;
                }
                x += v.sw;
            }
        }

        function needUpdate(bounds, tag, board) {
            var cloudCollision = (!bounds || !cloudCollide(tag, board, size[0]));
            return cloudCollision && (!bounds || collideRects(tag, bounds));
        }

        function place(board, tag, bounds, checkUpdate) {
            var startX = tag.x,
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

                if (!isTagStickingOut(tag, size)) {
                    // TODO only check for collisions within current bounds.
                    if (checkUpdate(bounds, tag, board)) {

                        updateBoard(board, tag);

                        delete tag.sprite;
                        return true;
                    }
                }
            }
            return false;
        }

        cloud.timeInterval = function (_) {
            if (arguments.length) {
                if (_ === null) {
                    timeInterval = Infinity;
                } else {
                    timeInterval = _;
                }
                return cloud;
            } else {
                return timeInterval;
            }
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
            if (arguments.length) {
                font = d3.functor(_);
                return cloud;
            } else {
                return font;
            }
        };

        cloud.fontStyle = function (_) {
            if (arguments.length) {
                fontStyle = d3.functor(_);
                return cloud;
            } else {
                return fontStyle;
            }
        };

        cloud.fontWeight = function (_) {
            return arguments.length ?
                (fontWeight = d3.functor(_), cloud) :
                fontWeight;
        };

        cloud.rotate = function (_) {
            if (arguments.length) {
                rotate = d3.functor(_);
                return cloud;
            } else {
                return rotate;
            }
        };

        cloud.text = function (_) {
            return arguments.length ? (text = d3.functor(_), cloud) : text;
        };

        cloud.spiral = function (_) {
            if (arguments.length) {
                spiral = spirals[_] || _;
                return cloud;
            } else {
                return spiral;
            }
        };

        cloud.fontSize = function (_) {
            if (arguments.length) {
                fontSize = d3.functor(_);
                return cloud;
            } else {
                return fontSize;
            }
        };

        cloud.padding = function (_) {
            if (arguments.length) {
                padding = d3.functor(_);
                return cloud;
            } else {
                return padding;
            }
        };

        cloud.random = function (_) {
            return arguments.length ? (random = _, cloud) : random;
        };

        cloud.prepWordTags = prepWordTags;
        cloud.updateBoard = updateBoard;

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
    function setupTag(tag, x, y, width, height) {
        tag.width = width;
        tag.height = height;
        tag.xoff = x;
        tag.yoff = y;
        tag.x1 = width >> 1;
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

    function addTagSprite(d, pixels) {
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

    function placeText(canvas, d, x, y) {
        canvas.translate(x / ratio, y / ratio);
        if (d.rotate) {
            canvas.rotate(d.rotate * cloudRadians);
        }
        canvas.fillText(d.text, 0, 0);
    }

    function computeTextPos(w, h, maxh, x, y) {
        if (h > maxh) {
            maxh = h;
        }
        if (x + w >= (cw << 5)) {
            x = 0;
            y += maxh;
            maxh = 0;
        }
        return {maxh: maxh, x: x, y: y};
    }

    function updateTags(data, di, pixels) {
        while (--di >= 0) {
            d = data[di];
            if (!d.hasText) {
                continue;
            }
            if (d.xoff === null) {
                break;
            }
            addTagSprite(d, pixels);
        }
    }

    function cloudSprite(data, di) {
        var x, y, maxh, n;
        var wh;
        var w, h;
        var textX;
        var textY;
        var d;

        d = data[di];

        c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
        x = 0;
        y = 0;
        maxh = 0;
        n = data.length;
        --di;
        while (++di < n) {
            d = data[di];
            c.save();
            c.font = ~~((d.size + 1) / ratio) +
                'px ' + d.font;
            w = c.measureText(d.text + 'm').width * ratio;
            wh = computeWH(d, w);
            h = wh.h;
            w = wh.w;

            var __ret = computeTextPos(w, h, maxh, x, y);
            maxh = __ret.maxh;
            x = __ret.x;
            y = __ret.y;

            if (y + h >= ch) {
                break;
            }
            textX = (x + (w >> 1));
            textY = (y + (h >> 1));
            placeText(c, d, textX, textY);
            c.restore();
            setupTag(d, x, y, w, h);
            x += w;
        }

        return di;

    }

    function isTagStickingOut(tag, size) {
        var toTheLeft = tag.x + tag.x0 < 0;
        var toTheTop = tag.y + tag.y0 < 0;
        var toTheRight = tag.x + tag.x1 > size[0];
        var toTheBottom = tag.y + tag.y1 > size[1];

        return toTheTop || toTheRight || toTheLeft || toTheBottom;
    }

    function setupValues(tag, size) {
        var w, lx, sx, x, h, sw;
        w = tag.width >> 5;
        lx = tag.x - (w << 4);
        sx = lx & 0x7f;
        sw = size[0] >> 5;
        x = (tag.y + tag.y0) * sw + (lx >> 5);
        h = tag.y1 - tag.y0;
        return {w: w, sx: sx, x: x, h: h, sw: sw};
    }

    // Use mask-based collision detection.
    function cloudCollide(tag, board, sw) {
        var cond;
        var sprite, msx, x, last;
        var size = [sw, 0];

        var v = setupValues(tag, size);

        sw >>= 5;
        x = v.x;
        sprite = tag.sprite;
        msx = 32 - v.sx;

        for (var j = 0; j < v.h; j++) {
            last = 0;
            for (var i = 0; i <= v.w; i++) {
                cond = last << msx;
                if (i < v.w) {
                    last = sprite[j * v.w + i];
                    cond = cond | last >>> v.sx;
                }
                if (cond & board[x + i]) {
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

    var cloudRadians, cw, ch, canvas, ratio, c;

    cloudRadians = Math.PI / 180;
    ch = 1 << 11;
    cw = ch >> 5;
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

    c = canvas.getContext('2d');
    var spirals = {
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
    t.cloud.placeText = placeText;
    t.cloud.computeTextPos = computeTextPos;
    t.cloud.setupValues = setupValues;
    t.cloud.cloudCollide = cloudCollide;
    t.cloud.addTagSprite = addTagSprite;
    t.cloud.cloudSprite = cloudSprite;
    t.cloud.updateTags = updateTags;

}('undefined' === typeof exports ? d3.layout || (d3.layout = {}) : exports));
