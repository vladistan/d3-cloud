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

    describe('Boundary Functions', function () {

        describe('Cloud Bounds', function () {

            var bounds;

            beforeEach('Init bounds', function () {
                bounds = [{x: 10, y: 15}, {x: 20, y: 25}];
            });

            it('Should Do nothing when obj is in the bounds', function () {
                var obj = {x0: 3, y0: 3, x: 10, y: 14};
                d3.layout.cloud.cloudBounds(bounds, obj);

                expect(bounds[0].x).to.equal(10);
                expect(bounds[0].y).to.equal(15);
                expect(bounds[1].x).to.equal(20);
                expect(bounds[1].y).to.equal(25);
            });
        });
    });

    describe('Cloud layout', function () {

        it('zero Array should make array of zeros', function () {
            var rv = d3.layout.cloud.zeroArray(3);
            expect(rv[0]).to.equal(0);
            expect(rv[1]).to.equal(0);
            expect(rv[2]).to.equal(0);
        });
    });

    describe('Cloud layout props', function () {
        describe('Cloud layout.words props', function () {
            it('should set words and return cloud ref', function () {
                var cloud = d3.layout.cloud();
                var rv = cloud.words(['a', 'b', 'c']);
                expect(rv).to.equal(cloud);
            });

            it('should return words when invoked with no args', function () {
                var cloud = d3.layout.cloud();
                cloud.words(['a', 'b', 'c']);
                var rv = cloud.words();
                expect(rv[0]).to.equal('a');
                expect(rv[1]).to.equal('b');
                expect(rv[2]).to.equal('c');
            });

        });
    });
});
