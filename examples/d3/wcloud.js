/* jshint -W030, -W101, -W016, -W117, -W004, -W008, -W116, -W089, -W058, -W055, -W018 */

// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

function generate() {
    layout.font(d3.select('#font')
        .property('value'))
        .spiral(d3.select('input[name=spiral]:checked')
            .property('value')),
        fontSize = d3.scale[d3.select('input[name=scale]:checked')
            .property('value')]()
            .range([10, 100]),
    tags.length && fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]),
        complete = 0, statusText.style('display', null), words = [],
        layout.stop()
            .words(tags.slice(
                0,
                max = Math.min(tags.length, +d3.select('#max').property('value'))))
            .start()
}

function draw(t, e) {
    statusText.style('display', 'none');
    scale = e ? Math.min(w / Math.abs(e[1].x - w / 2),
        w / Math.abs(e[0].x - w / 2),
        h / Math.abs(e[1].y - h / 2),
        h / Math.abs(e[0].y - h / 2)) / 2 : 1,
        words = t;
    var n = vis.selectAll('text').data(words, function (t) {
        return t.text.toLowerCase()
    });
    n.transition().duration(1e3).attr('transform', function (t) {
        return 'translate(' + [t.x, t.y] + ')rotate(' + t.rotate + ')'
    }).style('font-size', function (t) {
        return t.size + 'px'
    }), n.enter().append('text').attr('text-anchor', 'middle').attr('transform', function (t) {
        return 'translate(' + [t.x, t.y] + ')rotate(' + t.rotate + ')'
    }).style('font-size', '1px').transition().duration(1e3).style('font-size', function (t) {
        return t.size + 'px'
    }), n.style('font-family', function (t) {
        return t.font
    }).style('fill', function (t) {
        return fill(t.text.toLowerCase())
    }).text(function (t) {
        return t.text
    });
    var a = background.append('g').attr('transform', vis.attr('transform')),
        r = a.node();
    n.exit().each(function () {
        r.appendChild(this)
    }),
        a.transition()
            .duration(1e3)
            .style('opacity', 1e-6)
            .remove(),
        vis.transition()
            .delay(1e3)
            .duration(750)
            .attr('transform', 'translate(' + [w >> 1, h >> 1] + ')scale(' + scale + ')')
}

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
                for (var n, s = +new Date; +new Date - s < timeInterval && ++u < o && timer;) {
                    n = data[u];
                    n.x = (size[0] * (Math.random() + 0.5)) >> 1;
                    n.y = (size[1] * (Math.random() + 0.5)) >> 1;
                    cloudSprite(n, data, u);
                    place(board, n, bounds) && (tags.push(n),
                        event.word(n), bounds ? cloudBounds(bounds, n) : bounds = [{
                        x: n.x + n.x0,
                        y: n.y + n.y0
                    }, {
                        x: n.x + n.x1,
                        y: n.y + n.y1
                    }],
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
            for (var r, dx, dy,
                     startX = ([{x: 0, y: 0}, {x: size[0], y: size[1]}], tag.x),
                     startY = tag.y,
                     maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
                     d = spiral(size),
                     dt = Math.random() < 0.5 ? 1 : -1,
                     p = -dt;
                 (r = d(p += dt)) && (dx = ~~r[0], dy = ~~r[1],
                     !(Math.min(dx, dy) > maxDelta));) {
                if (tag.x = startX + dx,
                        tag.y = startY + dy,
                        !(tag.x + tag.x0 < 0 ||
                        tag.y + tag.y0 < 0 ||
                        tag.x + tag.x1 > size[0] ||
                        tag.y + tag.y1 > size[1] ||
                        bounds &&
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

        return d3.rebind(cloud, event, 'on');
    }

    function cloudText(d) {
        return d.text;
    }

    function cloudFont() {
        return 'serif';
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
    function cloudSprite(t, data, di) {
        if (!t.sprite) {
            cnv.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
            var a = 0,
                r = 0,
                maxh = 0,
                s = data.length;
            for (di--; ++di < s;) {
                t = data[di],
                    cnv.save(),
                    cnv.font = ~~((t.size + 1) / ratio) +
                        'px ' + t.font;
                var l = cnv.measureText(t.text + 'm').width * ratio,
                    u = t.size << 1;
                if (t.rotate) {
                    var sr = Math.sin(t.rotate * cloudRadians),
                        cr = Math.cos(t.rotate * cloudRadians),
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
                t.rotate && cnv.rotate(t.rotate * cloudRadians);
                cnv.fillText(t.text, 0, 0);
                cnv.restore();
                t.width = l;
                t.height = u;
                t.xoff = a;
                t.yoff = r;
                t.x1 = l >> 1;
                t.y1 = u >> 1;
                t.x0 = -t.x1;
                t.y0 = -t.y1;
                a += l
            }
            for (var pixels = cnv.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
                     sprite = [];
                 --di >= 0;) {
                t = data[di];
                // Zero the buffer
                for (var l = t.width,
                         w32 = l >> 5,
                         u = t.y1 - t.y0,
                         z = t.padding,
                         C = 0;
                     u * w32 > C;
                     C++) {
                    sprite[C] = 0;
                }
                if (a = t.xoff, null == a) {
                    return;
                }
                r = t.yoff;
                for (var seen = 0, seenRow = -1, A = 0; u > A; A++) {
                    for (var C = 0; l > C; C++) {
                        var L = w32 * A + (C >> 5),
                            I = pixels[(r + A) * (cw << 5) + (a + C) << 2] ? 1 << 31 - C % 32 : 0;
                        z && (A && (sprite[L - w32] |= I), l - 1 > A &&
                        (sprite[L + w32] |= I), I |= I << 1 | I >> 1),
                            sprite[L] |= I,
                            seen |= I
                    }
                    if (seen) {
                        seenRow = A
                    } else {
                        t.y0++;
                        u--;
                        A--;
                        r++;
                    }
                }
                t.y1 = t.y0 + seenRow;
                t.sprite = sprite.slice(0, (t.y1 - t.y0) * w32);
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

}('undefined' == typeof exports ? d3.layout || (d3.layout = {}) : exports));

var fill = d3.scale.category20b(),
    w = 640,
    h = 480,
    words = [],
    max, scale = 1,
    complete = 0,
    keyword = '',
    tags, fontSize, maxLength = 30,
    fetcher, statusText = d3.select('#status'),
    layout = d3.layout.cloud()
        .timeInterval(10)
        .size([w, h])
        .fontSize(function (t) {
            return fontSize(+t.value)
        }).text(function (t) {
            return t.key
        }).on('word', progress).on('end', draw),
    svg = d3.select('#vis')
        .append('svg')
        .attr('width', w)
        .attr('height', h),
    background = svg.append('g'),
    vis = svg.append('g')
        .attr('transform', 'translate(' + [w >> 1, h >> 1] + ')');

d3.select(window)
    .on('hashchange', hashchange);

var form = d3.select('#form').on('submit', function () {
    load(d3.select('#text').property('value')), d3.event.preventDefault()
});
form.selectAll('input[type=number]').on('click.refresh', function () {
    this.value !== this.defaultValue && (generate(), this.defaultValue = this.value)
}), form.selectAll('input[type=radio], #font').on('change', generate);
var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
    punctuation = new RegExp('[' + unicodePunctuationRe + ']', 'g'),
    wordSeparators = /[ \f\n\r\t\v\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
    discard = /^(@|https?:|\/\/)/,
    htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
    matchTwitter = /^https?:\/\/([^\.]*\.)?twitter\.com/;

testText = 'This works for some uses of a very small area of D3 API. I can imagine TDDing ' +
    'like this. But the fake API is small and flawed, and there s a lot more work to be ' +
    'done. This spike ' +
    'has convinced me that a fake D3 is possible. If the community were to come together, ' +
    'or a lone hero were ' +
    'to step forward, test driving our complex D3 graphs could become a possibility. Until ' +
    'then, we have to settle ' +
    'for regression testing.';

hashchange(testText);
d3.select('#random-palette').on('click', function () {
    paletteJSON('http://www.colourlovers.com/api/palettes/random', {}, function (t) {
        fill.range(t[0].colors), vis.selectAll('text').style('fill', function (t) {
            return fill(t.text.toLowerCase())
        })
    });
    d3.event.preventDefault()
});
