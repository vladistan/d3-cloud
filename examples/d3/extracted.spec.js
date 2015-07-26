/* jshint -W117, -W030 */
'use strict';

describe('Basic Test', function () {

    it('Should test somethong', function () {
        expect('bo').to.contain('b');
    });

    it('Should try to flatten thing', function () {
        var rv = flatten('Test', []);
        expect(rv).to.equal('Test');
    });
});
