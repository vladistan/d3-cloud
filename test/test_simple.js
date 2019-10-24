chai.should();

const cloud = require('..');


describe('Word cloud layout', function () {

    describe('Silly funcions', () => {

        let c;

        beforeEach( () => {
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

    describe('Bounds work', () => {
        let cloudBounds;

        beforeEach( () => {
           cloudBounds = new cloud().testPoints.cloudBounds;
        });

        it('Silly bounds tests', () => {
            const bounds =  [0,0];
            const obj =

            cloudBounds(bounds, )
        })
    });


});
