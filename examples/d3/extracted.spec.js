/* jshint -W117, -W030 */
'use strict';

describe('Extracted functions', function () {

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

    describe('Text Parser', function () {
        it('Should parse the text', function () {
            var text = 'lorem ipsum dolor sit amet lorem sit sit sit';
            var separator = /[ \t]+/;
            parseText(text, separator);
            expect(tags.length).to.equal(5);
            expect(tags[0].key).to.equal('sit');
            expect(tags[0].value).to.equal(4);
            expect(tags[1].key).to.equal('lorem');
            expect(tags[1].value).to.equal(2);
        });

        it('Should discard things to be discarded', function () {
            var text = 'lorem @bob http://www.google.com ipsum ' +
                'dolor sit amet lorem //sock';
            var separator = /[ \t]+/;
            parseText(text, separator);
            expect(tags.length).to.equal(5);
        });

        it('Should drop stop words', function () {
            var text = 'lorem are ipsum dolor sit amet lorem sit sit sit';
            var separator = /[ \t]+/;
            parseText(text, separator);
            expect(tags.length).to.equal(5);
        });

        it('Should collate ignoring case but preserve case on the keys', function () {
            var text = 'lorem are ipsum dolor Sit amet lorem  sit sit sit sit Sit';
            var separator = /[ \t]+/;
            parseText(text, separator);
            expect(tags.length).to.equal(5);
            expect(tags[0].key).to.equal('Sit');
            expect(tags[0].value).to.equal(6);
            expect(tags[1].key).to.equal('lorem');

        });

        it('Clip words longer than max length', function () {
            var text = 'lorem are ipsum dolor sit amet lorem sit sit sit';
            var separator = /\n/;
            parseText(text, separator);
            expect(tags.length).to.equal(1);
            expect(tags[0].key).to.equal('lorem are ipsum dolor sit amet');
        });
    });

    describe('Scale', function () {

        it('should give scale of 1 for empty element', function () {
            var rv = computeScale(null);
            expect(rv).to.equal(1);
        });
        it('should give scale of 2 an element half the screen', function () {
            var e = [{x: 320, y: 280}, {x: 160, y: 360}];
            var rv = computeScale(e);
            expect(rv).to.equal(2);
        });
    });

    describe('MoveSpinXFOrm', function () {
        it('should compose xform', function () {
            var rv = moveRotateXForm(34, 22, 11);
            expect(rv).to.equal('translate(34,22)rotate(11)');
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

            it('Should expand x0 when obj is to the left', function () {
                var obj = {x0: 3, y0: 3, x: 3, y: 14};
                d3.layout.cloud.cloudBounds(bounds, obj);

                expect(bounds[0].x).to.equal(6);
                expect(bounds[0].y).to.equal(15);
                expect(bounds[1].x).to.equal(20);
                expect(bounds[1].y).to.equal(25);
            });

            it('Should expand x0,y0 when obj is to the top and left', function () {
                var obj = {x0: 3, y0: 3, x: 3, y: 5};
                d3.layout.cloud.cloudBounds(bounds, obj);

                expect(bounds[0].x).to.equal(6);
                expect(bounds[0].y).to.equal(8);
                expect(bounds[1].x).to.equal(20);
                expect(bounds[1].y).to.equal(25);
            });

            it('Should expand x1,y1 when obj is to the bottom and right', function () {
                var obj = {x0: 23, y0: 20, x1: 40, y1: 45, x: 12, y: 12};
                d3.layout.cloud.cloudBounds(bounds, obj);

                expect(bounds[0].x).to.equal(10);
                expect(bounds[0].y).to.equal(15);
                expect(bounds[1].x).to.equal(52);
                expect(bounds[1].y).to.equal(57);
            });
        });

        describe('Collide Rects', function () {

            var bounds;

            beforeEach('Init bounds', function () {
                bounds = [{x: 10, y: 15}, {x: 20, y: 30}];
            });

            it('OK if rect all inside', function () {
                var tag = {x: 15, y: 25, x0: -3, x1: 3, y0: -4, y1: 2};
                var rv = d3.layout.cloud.collideRects(tag, bounds);
                expect(rv).to.be.true();
            });

            it('False if rect is above no overlap', function () {
                var tag = {x: -45, y: -45, x0: -3, x1: 3, y0: -4, y1: 2};
                var rv = d3.layout.cloud.collideRects(tag, bounds);
                expect(rv).to.be.false();
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

        it('Prep Tag Should setup the tag center and has text', function () {
            var d = {};

            d3.layout.cloud.setupTag(d, 30, 20, 8, 6);
            expect(d.xoff).to.equal(30);
            expect(d.yoff).to.equal(20);
            expect(d.x1).to.equal(4);
            expect(d.x0).to.equal(-4);
            expect(d.y1).to.equal(3);
            expect(d.y0).to.equal(-3);
        });

        it('Prep word tags should make sorted tags out of words', function () {
            var cloud = d3.layout.cloud();
            cloud.text(function (t) {
                return t;
            });
            cloud.fontSize(function (t) {
                return t.charCodeAt(0) / 2;
            });
            cloud.words(['a', 'c', 'z']);
            var rv = cloud.prepWordTags();
            expect(rv.length).to.equal(3);
            expect(rv[0].text).to.equal('z');
            expect(rv[1].size).to.equal(49);

        });

        describe('Compute value of M', function () {

            var pixels, m;
            beforeEach(function () {
                pixels = d3.layout.cloud.zeroArray(20);
                m = 9;
            });

            it('Should set M to be 0 if corresponding pixels is empty ', function () {
                    m = d3.layout.cloud.computeM(pixels, 2, 1, 4, 2, m);
                    expect(m).to.equal(0);
                }
            );

            it('Should set M to be non zero if corresponding pixels is filled ',
                function () {
                    pixels[6150 * 4] = 9;
                    m = d3.layout.cloud.computeM(pixels, 2, 1, 4, 2, m);
                    expect(m).to.equal(134217728);
                }
            );

        });

        describe('Adjust sprite', function () {

            var sprite, d;

            beforeEach('setup', function () {
                sprite = d3.layout.cloud.zeroArray(3000);
                d = {};
            });

            it('Should do nothing when padding is off', function () {
                d.padding = false;
                var m = 8;
                m = d3.layout.cloud.adjustSprite(sprite, d, m, 10, 10, 10, 34);
                expect(m).to.equal(8);
            });

            it('Should expand M, but dont touch sprite when j and w are low',
                function () {
                    d.padding = 1;
                    sprite = d3.layout.cloud.zeroArray(3);
                    var m = 8;
                    m = d3.layout.cloud.adjustSprite(sprite, d, m, 12, 0, 1, 34);
                    expect(sprite.length).to.equal(3);
                    expect(sprite[0]).to.equal(8 + 4 + 16);
                    expect(sprite[1]).to.equal(0);
                    expect(sprite[2]).to.equal(0);
                    expect(m).to.equal(8 + 4 + 16);
                });

            it('Should expand M, but should put m into w32 up and down around k',
                function () {
                    d.padding = 1;
                    sprite = d3.layout.cloud.zeroArray(3);
                    var m = 16;
                    d3.layout.cloud.adjustSprite(sprite, d, m, 1, 1, 5, 1);
                    expect(sprite.length).to.equal(3);
                    expect(sprite[0]).to.equal(16);
                    expect(sprite[1]).to.equal(16 + 8 + 32);
                    expect(sprite[2]).to.equal(16);

                });
        });

        describe('Compute text posistion', function () {

            it('Should update maxH when its less than H', function () {
                var h = 19;
                var maxH = 15;
                var rv = d3.layout.cloud.computeTextPos(0, h, maxH, 0, 0);
                expect(rv.maxh).to.equal(h);
            });

            it('Should not update maxH when its larger than H', function () {
                var h = 19;
                var maxH = 95;
                var rv = d3.layout.cloud.computeTextPos(0, h, maxH, 0, 0);
                expect(rv.maxh).to.equal(95);
            });

            it('Should move to the new line when x + width is over 64',
                function () {
                    var h = 19;
                    var maxH = 40;
                    var rv = d3.layout.cloud.computeTextPos(30, h, maxH, 2030, 20);
                    expect(rv.maxh).to.equal(0);
                    expect(rv.x).to.equal(0);
                    expect(rv.y).to.equal(60);
                });
        });

        describe('Should compute value of WH', function () {

            var d;
            beforeEach(function () {
                d = {};
                d.size = 9;
            });

            it('Should return h=h*2 when D not rotated ',
                function () {
                    var rv = d3.layout.cloud.computeWH(d, 200);
                    expect(rv.h).to.equal(18);
                }
            );

            it('Should return w=w+31 when D not rotated ',
                function () {
                    var rv = d3.layout.cloud.computeWH(d, 33);
                    expect(rv.w).to.equal(64);
                }
            );

            it('Should return w=w+31 rounded up to next mul of 32 when D not rotated ',
                function () {
                    var rv = d3.layout.cloud.computeWH(d, 34);
                    expect(rv.w).to.equal(64);
                }
            );

            it('Should compute proper envelope when rotated ',
                function () {
                    d.rotate = 45;
                    var rv = d3.layout.cloud.computeWH(d, 34);
                    expect(rv.h).to.equal(36);
                    expect(rv.w).to.equal(64);
                }
            );

            it('When flipped envelope should be same as not rotated ',
                function () {
                    d.rotate = 180;
                    var rv = d3.layout.cloud.computeWH(d, 34);
                    expect(rv.h).to.equal(18);
                    expect(rv.w).to.equal(64);
                }
            );

        });

        describe('isTagStickingOut', function () {

            var size;

            beforeEach('Setup', function () {
                size = [40, 40];
            });

            it('should return false when all inside', function () {
                var tag = {x: 20, y: 20, x0: -5, x1: 5, y0: -5, y1: 5};
                var rv = d3.layout.cloud.isTagStickingOut(tag, size);
                expect(rv).to.be.false();
            });

            it('should return true when to the left', function () {
                var tag = {x: 20, y: 20, x0: -25, x1: 5, y0: -5, y1: 5};
                var rv = d3.layout.cloud.isTagStickingOut(tag, size);
                expect(rv).to.be.true();
            });

            it('should return true when to the right', function () {
                var tag = {x: 20, y: 20, x0: -4, x1: 45, y0: -5, y1: 5};
                var rv = d3.layout.cloud.isTagStickingOut(tag, size);
                expect(rv).to.be.true();
            });

            it('should return true when to the top', function () {
                var tag = {x: 20, y: 20, x0: -4, x1: 5, y0: -25, y1: 5};
                var rv = d3.layout.cloud.isTagStickingOut(tag, size);
                expect(rv).to.be.true();
            });

            it('should return true when to the bottom', function () {
                var tag = {x: 20, y: 20, x0: -4, x1: 5, y0: -5, y1: 35};
                var rv = d3.layout.cloud.isTagStickingOut(tag, size);
                expect(rv).to.be.true();
            });
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
