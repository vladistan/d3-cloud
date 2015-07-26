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
});
