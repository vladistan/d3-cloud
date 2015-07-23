/* jshint -W117, -W089 */
function hashchange(t) {
    var e = location.hash;
    if (e && e.length > 1) {
        e = decodeURIComponent(e.substr(1));
        if (e !== fetcher) {
            load(e);
        }
    } else {
        if (t) {
            load(t)
        }
    }
}

function progress() {
    statusText.text(++complete + '/' + max)
}

function proxy(url, element) {
    d3.text('//www.jasondavies.com/xhr?url=' + encodeURIComponent(url), element)
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
    return n.join(' ')
}

function parseHTML(text) {
    parseText(text.replace(htmlTags, ' ').replace(/&#(x?)([\dA-Fa-f]{1,4});/g,
        function (t, e, n) {
            return String.fromCharCode(+((e ? '0x' : '') + n))
        }).replace(/&\w+;/g, ' '))
}

function getURL(url, element) {
    if (statusText.text('Fetching\u2026 '),
            matchTwitter.test(url)) {
        var n = d3.select('body').append('iframe').style('display', 'none');
        d3.select(window).on('message', function () {
            var t = JSON.parse(d3.event.data);
            element((Array.isArray(t) ? t : t.results).map(function (t) {
                return t.text
            }).join('\n\n'));
            n.remove()
        });

        n.attr('src', 'http://jsonp.jasondavies.com/?' + encodeURIComponent(url));

        try {
            if ('https:' !== location.protocol || /^https:/.test(url)) {
                d3.text(url, function (n) {
                    if (null === n) {
                        proxy(url, element)
                    } else {
                        element(n)
                    }
                })
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
    t.split(d3.select('#per-line').property('checked') ? /\n/g : wordSeparators)
        .forEach(function (t) {
            discard.test(t) ||
            (t = t.replace(punctuation, ''),
            stopWords.test(t.toLowerCase()) ||
            (t = t.substr(0, maxLength),
                e[t.toLowerCase()] = t,
                tags[t = t.toLowerCase()] = (tags[t] || 0) + 1))
        }),

        tags = d3.entries(tags).sort(function (t, e) {
            return e.value - t.value
        }), tags.forEach(function (t) {
        t.key = e[t.key]
    }), generate()
}

function load(t) {
    fetcher = t;
    var e = /^(https?:)?\/\//.test(fetcher) ? '#' + encodeURIComponent(fetcher) : '';
    null != fetcher && d3.select('#text').property('value', fetcher),
    location.hash !== e && (location.hash = e),
        e ? getURL(fetcher, parseHTML) : fetcher && parseText(fetcher)
}
