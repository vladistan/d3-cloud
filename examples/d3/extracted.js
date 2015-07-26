/* jshint -W117, -W089, -W030 */

var unicodePunctuationRe = '!-#%-*,-/:;?@\\[-\\]_{}\xa1\xa7\xab' +
    '\xb6\xb7\xbb\xbf\u037e\u0387' +
    '\u055a-\u055f\u0589\u058a\u05be\u05c0\u05c3\u05c6\u05f3\u05f4' +
    '\u0609\u060a\u060c\u060d' +
    '\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-' +
    '\u07f9\u0830-\u083e\u085e' +
    '\u0964\u0965\u0970\u0af0\u0df4\u0e4f\u0e5a\u0e5b\u0f04-' +
    '\u0f12\u0f14\u0f3a-\u0f3d' +
    '\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1360-' +
    '\u1368\u1400\u166d\u166e' +
    '\u169b\u169c\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-' +
    '\u17da\u1800-\u180a\u1944' +
    '\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60' +
    '\u1bfc-\u1bff\u1c3b-\u1c3f' +
    '\u1c7e\u1c7f\u1cc0-\u1cc7\u1cd3\u2010-\u2027\u2030-\u2043' +
    '\u2045-\u2051\u2053-\u205e' +
    '\u207d\u207e\u208d\u208e\u2329\u232a\u2768-\u2775\u27c5' +
    '\u27c6\u27e6-\u27ef\u2983-\u2998' +
    '\u29d8-\u29db\u29fc\u29fd\u2cf9-\u2cfc\u2cfe\u2cff\u2d70' +
    '\u2e00-\u2e2e\u2e30-\u2e3b' +
    '\u3001-\u3003\u3008-\u3011\u3014-\u301f\u3030\u303d\u30a0' +
    '\u30fb\ua4fe\ua4ff\ua60d-\ua60f' +
    '\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-' +
    '\ua8fa\ua92e\ua92f\ua95f' +
    '\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uaaf0' +
    '\uaaf1\uabeb\ufd3e\ufd3f' +
    '\ufe10-\ufe19\ufe30-\ufe52\ufe54-\ufe61\ufe63\ufe68\ufe6a' +
    '\ufe6b\uff01-' +
    '\uff03\uff05-\uff0a\uff0c-\uff0f\uff1a\uff1b\uff1f\uff20' +
    '\uff3b-\uff3d\uff3f' +
    '\uff5b\uff5d\uff5f-\uff65';

function hashchange(t) {
    var e = location.hash;
    if (e && e.length > 1) {
        e = decodeURIComponent(e.substr(1));
        if (e !== fetcher) {
            load(e);
        }
    } else {
        if (t) {
            load(t);
        }
    }
}

function progress() {
    statusText.text(++complete + '/' + max);
}

function proxy(url, element) {
    d3.text('//www.jasondavies.com/xhr?url=' + encodeURIComponent(url), element);
}

function flatten(t, e) {
    if ('string' === typeof t) {
        return t;
    }
    var n = [];
    for (e in t) {
        var a = flatten(t[e], e);
        if (a) {
            n.push(a);
        }
    }
    return n.join(' ');
}

function parseHTML(text) {
    parseText(text.replace(htmlTags, ' ').replace(/&#(x?)([\dA-Fa-f]{1,4});/g,
        function (t, e, n) {
            return String.fromCharCode(+((e ? '0x' : '') + n));
        }).replace(/&\w+;/g, ' '));
}

function getURL(url, element) {
    if (statusText.text('Fetching\u2026 '),
            matchTwitter.test(url)) {
        var n = d3.select('body').append('iframe').style('display', 'none');
        d3.select(window).on('message', function () {
            var t = JSON.parse(d3.event.data);
            element((Array.isArray(t) ? t : t.results).map(function (t) {
                return t.text;
            }).join('\n\n'));
            n.remove();
        });

        n.attr('src', 'http://jsonp.jasondavies.com/?' + encodeURIComponent(url));

        try {
            if ('https:' !== location.protocol || /^https:/.test(url)) {
                d3.text(url, function (n) {
                    if (null === n) {
                        proxy(url, element);
                    } else {
                        element(n);
                    }
                });
            } else {
                proxy(url, element);
            }
        } catch (a) {
            proxy(url, element);
        }
    }
}

function parseText(t) {
    tags = {};
    var e = {};
    t.split(d3.select('#per-line')
        .property('checked') ? /\n/g : wordSeparators)
        .forEach(function (t) {
            discard.test(t) ||
            (t = t.replace(punctuation, ''),
            stopWords.test(t.toLowerCase()) ||
            (t = t.substr(0, maxLength),
                e[t.toLowerCase()] = t,
                tags[t = t.toLowerCase()] = (tags[t] || 0) + 1));
        });

    tags = d3.entries(tags).sort(function (t, e) {
        return e.value - t.value;
    });
    tags.forEach(function (t) {
        t.key = e[t.key];
    });
    generate();
}

function load(t) {
    fetcher = t;
    var e = /^(https?:)?\/\//.test(fetcher) ? '#' + encodeURIComponent(fetcher) : '';
    if (null !== fetcher) {
        d3.select('#text').property('value', fetcher);
    }
    if (location.hash !== e) {
        location.hash = e;
    }
    if (e) {
        getURL(fetcher, parseHTML);
    } else {
        if (fetcher) {
            parseText(fetcher);
        }
    }
}
