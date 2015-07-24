/* jshint -W016, -W004, -W117, -W058, -W055, -W018, -W030 */

// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

(function (t) {
    function cloud() {

        var size = [256, 256],
            text = cloudText,
            font = cloudFont,
            fontSize = cloudFontSize,
            rotate = cloudRotate,
            padding = cloudPadding,
            spiral = archimedeanSpiral,
            words = [],
            timeInterval = Infinity,
            event = d3.dispatch('word', 'end'),
            timer = null,
            cloud = {};

        cloud.start = function () {

            var board = zeroArray((size[0] >> 5) * size[1]),
                bounds = null,
                o = words.length,
                u = -1,
                tags = [],
                data = words.map(function (d, i) {
                    return {
                        text: text.call(this, d, i),
                        font: font.call(this, d, i),
                        rotate: rotate.call(this, d, i),
                        size: ~~fontSize.call(this, d, i),
                        padding: cloudPadding.call(this, d, i)
                    }
                }).sort(function (a, b) {
                    return b.size - a.size;
                });

            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(step, 0);
            step();

            return cloud;

            function step() {
                for (var n, s = +new Date;
                     +new Date - s < timeInterval && ++u < o && timer;) {
                    n = data[u];
                    n.x = (size[0] * (Math.random() + 0.5)) >> 1;
                    n.y = (size[1] * (Math.random() + 0.5)) >> 1;
                    cloudSprite(n, data, u);
                    place(board, n, bounds) && (tags.push(n),
                        event.word(n), bounds ? cloudBounds(bounds, n) :
                        bounds = [
                            {x: n.x + n.x0, y: n.y + n.y0},
                            {x: n.x + n.x1, y: n.y + n.y1}],
                        // Temporary hack
                        n.x -= size[0] >> 1,
                        n.y -= size[1] >> 1);
                }
                if (u >= o) {
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

        function place(board, tag, bounds) {
            for (var perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}],
                     startX = tag.x,
                     startY = tag.y,
                     maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
                     d = spiral(size),
                     dt = Math.random() < 0.5 ? 1 : -1,
                     p = -dt,
                     dx,
                     dy,
                     dxdy;
                 (dxdy = d(p += dt)) && (dx = ~~dxdy[0], dy = ~~dxdy[1],
                     !(Math.min(dx, dy) > maxDelta));) {
                if (tag.x = startX + dx,
                        tag.y = startY + dy,
                        !(tag.x + tag.x0 < 0 ||
                        tag.y + tag.y0 < 0 ||
                        tag.x + tag.x1 > size[0] ||
                        tag.y + tag.y1 > size[1] ||
                        bounds &&
                            // TODO only check for collisions within current bounds.
                        cloudCollide(tag, board, size[0]) ||
                        bounds && !collideRects(tag, bounds))) {
                    for (
                        var sprite = tag.sprite,
                            w = tag.width >> 5,
                            sw = size[0] >> 5,
                            lx = tag.x - (w << 4),
                            sx = lx & 0x7f,
                            msx = 32 - sx,
                            h = tag.y1 - tag.y0,
                            x = (tag.y + tag.y0) * sw + (lx >> 5),
                            j = 0,
                            last;
                        h > j; j++) {
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
            return false;
        }

        cloud.timeInterval = function (_) {
            return arguments.length ?
                (timeInterval = _ === null ? Infinity : _ , cloud) :
                timeInterval;
        };

        cloud.words = function (_) {
            return arguments.length ? (words = _, cloud) : words;
        };

        cloud.size = function (_) {
            return arguments.length ? (size = [+_[0], +_[1]], cloud) : size;
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

        return d3.rebind(cloud, event, 'on');
    }

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
    function cloudSprite(d, data, di) {
        if (!d.sprite) {
            cnv.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
            var a = 0,
                r = 0,
                maxh = 0,
                s = data.length;
            for (di--; ++di < s;) {
                d = data[di],
                    cnv.save(),
                    cnv.font = ~~((d.size + 1) / ratio) +
                        'px ' + d.font;
                var l = cnv.measureText(d.text + 'm').width * ratio,
                    u = d.size << 1;
                if (d.rotate) {
                    var sr = Math.sin(d.rotate * cloudRadians),
                        cr = Math.cos(d.rotate * cloudRadians),
                        wcr = l * cr,
                        wsr = l * sr,
                        hcr = u * cr,
                        hsr = u * sr;
                    l = Math.max(Math.abs(wcr + hsr),
                            Math.abs(wcr - hsr)) + 31 >> 5 << 5,
                        u = ~~Math.max(Math.abs(wsr + hcr),
                            Math.abs(wsr - hcr))
                } else {
                    l = l + 31 >> 5 << 5;
                }
                if (u > maxh && (maxh = u),
                    a + l >= cw << 5 &&
                    (a = 0, r += maxh, maxh = 0),
                    r + u >= ch) {
                    break;
                }
                cnv.translate((a + (l >> 1)) / ratio, (r + (u >> 1)) / ratio);
                if (d.rotate) {
                    cnv.rotate(d.rotate * cloudRadians);
                }
                cnv.fillText(d.text, 0, 0);
                cnv.restore();
                d.width = l;
                d.height = u;
                d.xoff = a;
                d.yoff = r;
                d.x1 = l >> 1;
                d.y1 = u >> 1;
                d.x0 = -d.x1;
                d.y0 = -d.y1;
                a += l
            }
            for (var pixels = cnv.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
                     sprite = [];
                 --di >= 0;) {
                d = data[di];
                // Zero the buffer
                for (var l = d.width,
                         w32 = l >> 5,
                         u = d.y1 - d.y0,
                         z = d.padding,
                         C = 0;
                     u * w32 > C;
                     C++) {
                    sprite[C] = 0;
                }
                if (a = d.xoff, null === a) {
                    return;
                }
                r = d.yoff;
                for (var seen = 0, seenRow = -1, A = 0; u > A; A++) {
                    for (var C = 0; l > C; C++) {
                        var L = w32 * A + (C >> 5),
                            I = pixels[(r + A) * (cw << 5) + (a + C) << 2] ?
                            1 << 31 - C % 32 :
                                0;
                        z && (A && (sprite[L - w32] |= I), l - 1 > A &&
                        (sprite[L + w32] |= I), I |= I << 1 | I >> 1),
                            sprite[L] |= I,
                            seen |= I
                    }
                    if (seen) {
                        seenRow = A
                    } else {
                        d.y0++;
                        u--;
                        A--;
                        r++;
                    }
                }
                d.y1 = d.y0 + seenRow;
                d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
            }
        }
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
        return a.x + a.x1 > b[0].x && a.x +
            a.x0 < b[1].x && a.y +
            a.y1 > b[0].y && a.y +
            a.y0 < b[1].y;
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
        var m = require('canvas');
        // Attempt to use node-canvas.
        canvas = new m(cw << 5, ch)
    }
    var cnv = canvas.getContext('2d'),
        spirals = {
            archimedean: archimedeanSpiral,
            rectangular: rectangularSpiral
        };
    cnv.fillStyle = 'red';
    cnv.textAlign = 'center';
    t.cloud = cloud;

}('undefined' === typeof exports ? d3.layout || (d3.layout = {}) : exports));
