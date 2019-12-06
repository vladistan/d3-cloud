export function expDIV(id, w ,h) {

    const div = document.createElement('div');
    div.setAttribute("id", 'guts');
    div.setAttribute("style", "display: block; width: 1200px; height: 700px; background: #fffff8; overflow: auto; border: solid black 1px");

    d3.select(div)
        .append('svg')
        .attr('id', id)
        .attr('height', h / 8)
        .attr('width', w / 8)
        .attr('transform', 'scale(8)')
        .style('transform-origin', '0 0')
    ;

    return div;
}

export function unrollNum(n) {

    const rv = [];
    for (let i = 0; i < 32; i++) {
        rv[32 - i] = n & (1) ? 1 : 0;
        n = n >> 1;
    }

    return rv;
}
