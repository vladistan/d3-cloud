/* jshint -W117, -W030 */
'use strict';

describe('Extracted functions', function () {

    describe('Flatten', function () {

        it('should return as is if input is a string', function () {
            var rv = flatten('Test', []);
            expect(rv).to.equal('Test');
        });

        it('should flatten arrays', function () {
            var rv = flatten(['a', 'b', ['c', 'd', 'e'], 'f'], []);
            expect(rv).to.equal('a b c d e f');
        });
    });

    describe('Progress', function () {
        it('Should be updated', function () {
            window.statusText = {};
            window.statusText.text = sinon.spy();
            window.complete = 9;
            window.max = 9;
            progress();
            expect(window.statusText.text).to.have.been.calledWith('10/9');
            expect(window.complete).to.equal(10);
        });
    });
});
