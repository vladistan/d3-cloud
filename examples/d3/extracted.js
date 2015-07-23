/* jshint -W117 */
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

function proxy(t, e) {
    d3.text('//www.jasondavies.com/xhr?url=' + encodeURIComponent(t), e)
}
