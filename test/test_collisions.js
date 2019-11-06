chai.should();

const cloud = require('..');

const collideRects = new cloud().testPoints.collideRects;
const setupDimensions = new cloud().testPoints.setupDimensions;

const bounds = [
    {x: 50, y: 50},
    {x: 150, y: 150},
];

describe('Collision', function () {


    describe('Rects', () => {

        let rect;

        beforeEach(() => {
            rect = {x: 30, y: 30,};
        });

        it('Non Intersecting, too far left', () => {

            setupDimensions(rect, 10, 10, 10, 10);
            rect.x = rect.xoff;
            rect.y = rect.yoff;

            const collide = collideRects(rect, bounds);
            collide.should.be.false;

        });

        it('Non Intersecting, too far right', () => {
            setupDimensions(rect, 180, 80, 40, 10);
            rect.x = rect.xoff;
            rect.y = rect.yoff;
            const collide = collideRects(rect, bounds);
            collide.should.be.false;
        });

        it('Intersecting from the top', () => {

            setupDimensions(rect, 55, 80, 10, 12);
            rect.x = rect.xoff;
            rect.y = rect.yoff;

            const collide = collideRects(rect, bounds);
            collide.should.be.true;

        });

        it('Intersecting from the left', () => {

            setupDimensions(rect, 20, 45, 66, 12);
            rect.x = rect.xoff;
            rect.y = rect.yoff;

            const collide = collideRects(rect, bounds);
            collide.should.be.true;

        });

    });

});
