chai.should();

const cloud = require('..');


describe('Spirals', function () {


    describe('Rectangular Spiral', () => {
        let rectSpiral;

        beforeEach(() => {
            rectSpiral = new cloud().testPoints.rectangularSpiral;
        });

        it('Small', () => {

            const spiralFunc = rectSpiral([100, 100]);

            const spiral = [...Array(6).keys()].map(i => spiralFunc(i));

            spiral[0].should.eql([4, 0]);
            spiral[1].should.eql([4, 4]);
            spiral[2].should.eql([0, 4]);
            spiral[3].should.eql([-4, 4]);
            spiral[4].should.eql([-4, 0]);
            spiral[5].should.eql([-4, -4]);

        });

    });

    describe('Archimedian Spiral', () => {
        let archimedeanSpiral;

        beforeEach(() => {
            archimedeanSpiral = new cloud().testPoints.archimedeanSpiral;
        });

        it('Small', () => {

            const spiralFunc = archimedeanSpiral([1, 1]);

            const spiral = [...Array(50).keys()].map(i =>  spiralFunc(i).map(x => Math.floor(x * 50)));

            spiral[0].should.eql([0, 0]);
            spiral[1].should.eql([4, 0]);
            spiral[2].should.eql([9, 1]);
            spiral[3].should.eql([14, 4]);
            spiral[20].should.eql([-42, 90]);
            spiral[25].should.eql([-101, 74]);
            spiral[40].should.eql([-131, -152]);
            spiral[49].should.eql([45, -241]);

        });

    });


});
