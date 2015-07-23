/* jshint -W117, -W004, -W016 */
(function () {

    function downloadPNG() {
        var t = document.createElement('canvas'),
            e = t.getContext('2d');

        t.width = w;
        t.height = h;
        e.translate(w >> 1, h >> 1);
        e.scale(scale, scale);
        words.forEach(function (t) {
            e.save();
            e.translate(t.x, t.y);
            e.rotate(t.rotate * Math.PI / 180);
            e.textAlign = 'center';
            e.fillStyle = fill(t.text.toLowerCase());
            e.font = t.size + 'px ' + t.font;
            e.fillText(t.text, 0, 0);
            e.restore();
        });
        d3.select(this)
            .attr('href', t.toDataURL('image/png'));
    }

    function downloadSVG() {
        d3.select(this)
            .attr('href', 'data:image/svg+xml;charset=utf-8;base64,' +
            btoa(unescape(encodeURIComponent(svg.attr('version', '1.1')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .node()
                .parentNode
                .innerHTML))))
    }

    d3.select('#download-svg')
        .on('click', downloadSVG);
    d3.select('#download-png')
        .on('click', downloadPNG);
}());
