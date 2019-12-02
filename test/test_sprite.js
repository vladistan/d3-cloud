chai.should();

const cloud = require('..');

describe('CloudCanvas', function () {

    const cld = cloud();


    it('returns correct canvas obj', function () {

        const canvas = cld.canvas()();
        canvas.should.be.a('HTMLCanvasElement');

    });

    it('has zeroArray that works correctly', function () {

        const zArr = cld.testPoints.zeroArray(9);

        zArr.length.should.eq(9);
        zArr[0].should.eq(0);
        zArr[8].should.eq(0);

    });

    it('has getContext that calculates correct ratio and sets up the context', function () {

        const canvas = cld.canvas()();

        const ctxAndRatio = cld.testPoints.getContext(canvas);

        ctxAndRatio.context.fillStyle.should.eq('#ff0000');
        ctxAndRatio.ratio.should.eq(1);


    });

    describe('Sprite', function () {

        it('Renders a simple dot correctly', function () {
                const canvas = cld.canvas()();
                const ctxAndRatio = cld.testPoints.getContext(canvas);
                const attrs = {font: 'Impact', padding: 0, size: 2, weight: 'light', style: 'normal'};
                const data = [Object.assign({text: '.'}, attrs),];
                const d = data[0];

                cld.testPoints.cloudSprite(ctxAndRatio, d, data, 0);

                d.width.should.eq(32);
                d.height.should.eq(4);
                const sprite = d.sprite;

                sprite.length.should.eq(3);
                sprite[0].should.eq(0x00018000);
                sprite[1].should.eq(0x00018000);
                sprite[2].should.eq(0);

            }
        );


    })

});

