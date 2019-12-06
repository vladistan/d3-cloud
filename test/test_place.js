chai.should();

const cloud = require('..');

describe('CloudCanvas', function () {

    const cld = cloud();


    describe('Place', function () {

        it('Place one simple thing works', function () {

                const canvas = cld.canvas()();
                const ctxAndRatio = cld.testPoints.getContext(canvas);

                const attrs = {font: 'Impact', padding: 0, size: 4, weight: 'light', style: 'normal'};
                const data = [Object.assign({text: '!', x: 0, y: 0}, attrs),];
                const d = data[0];

                const size = [64, 64];
                const board = cld.testPoints.zeroArray((size[0] >> 5) * size[1]);
                const bounds = [{x: 16, y: 10}, {x: size[0], y: size[1]}];

                cld.testPoints.cloudSprite(ctxAndRatio, d, data, 0);
                cld.testPoints.place(board, data[0], bounds);

                board.filter( n => n   )
                    .map(n => 1)
                    .reduce( (a,n) => a+n )
                    .should.eq(4);

            }
        );


    })

});

