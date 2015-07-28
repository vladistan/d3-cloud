/* jshint -W030, -W117, -W016 */

var fill = d3.scale.category20b(),
    w = 640,
    h = 480,
    words = [],
    max, scale = 1,
    complete = 0,
    keyword = '',
    tags,
    fontSize,
    maxLength = 30,
    fetcher,
    statusText = d3.select('#status'),
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

setupFormEvents();
hashchange(testText);
// setupRandomPallete();
