/* jshint -W030, -W101, -W016, -W117, -W004, -W008, -W116, -W089, -W058, -W055, -W018 */

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
    load(d3.select('#text').property('value'));
    d3.event.preventDefault()
});
form.selectAll('input[type=number]')
    .on('click.refresh', function () {
        if (this.value !== this.defaultValue) {
            generate();
            this.defaultValue = this.value;
        }
    });
form.selectAll('input[type=radio], #font').on('change', generate);

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
