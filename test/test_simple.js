chai.should();

const cloud = require('..');


describe('Word cloud layout', function () {

    describe('Silly funcitons', () => {

        let c;

        beforeEach(() => {
            c = new cloud();
        });

        it('Can set and get words', () => {
            c.words(['one', 'two']);
            c.words().should.eql(['one', 'two']);
        });


        it('Functors work', () => {
            const padding = c.padding();
            padding().should.eq(1);
        });
    });

    describe('Setting up dimension works', () => {

        let setupDimensions;

        beforeEach(() => {
            setupDimensions = new cloud().testPoints.setupDimensions;
        });

        it('Correctly sets up dimensions from sprite', () => {
            const d = {};
            setupDimensions(d, 100, 200, 44, 66 );

            d.hasText.should.be.true;

            d.width.should.eq(44);
            d.height.should.eq(66);

            d.xoff.should.eq(100);
            d.yoff.should.eq(200);

            // Half offsets right, bottom
            d.x1.should.eq(22);
            d.y1.should.eq(33);

            // Half offsets top, left
            d.x0.should.eq(-22);
            d.y0.should.eq(-33);


        })

    });

    describe('Bounds work', () => {
        let cloudBounds;
        let setupDimensions;

        beforeEach(() => {
            cloudBounds = new cloud().testPoints.cloudBounds;
            setupDimensions = new cloud().testPoints.setupDimensions;
        });

        it('Stretch initial center point to the extent of first obj', () => {
            const bounds = [{x:100, y:200}, {x:100, y:200}];
            const d = {x:100, y: 200};

            setupDimensions(d, d.x, d.y, 44, 66 );

            (d.x + d.x0).should.eq(78);

            cloudBounds(bounds, d);

            bounds[0].x.should.equal(78);  // 100 - 22   ( 22 = 44/2)
            bounds[0].y.should.equal(167); // 100 - 33  ( 33 = 66/2)
            bounds[1].x.should.equal(122); // 100 + 22
            bounds[1].y.should.equal(233); // 200 + 33

        });

        it('When new object added to the right and bottom,  should stretch only one corner', () => {

            const bounds = [{x:78, y:167}, {x:122, y:233}];

            const d = {x:140, y: 250};
            setupDimensions(d, d.x, d.y, 44, 66 );

            cloudBounds(bounds, d);

            bounds[0].x.should.equal(78);  // Intact
            bounds[0].y.should.equal(167); // Intact
            bounds[1].x.should.equal(162); // 140 + 22
            bounds[1].y.should.equal(283); // 250 + 33

        });

        it('When new object added to the left and top,  should stretch only one corner', () => {

            const bounds = [{x:78, y:167}, {x:162, y:283}];

            const d = {x:40, y: 50};
            setupDimensions(d, d.x, d.y, 20, 30 );

            cloudBounds(bounds, d);

            bounds[0].x.should.equal(30);  // 40 - 10
            bounds[0].y.should.equal(35); // 50 - 15
            bounds[1].x.should.equal(162); // 140 + 22
            bounds[1].y.should.equal(283); // 250 + 33

        })
    });


});
