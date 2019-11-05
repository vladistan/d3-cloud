import {action} from '@storybook/addon-actions';
import * as samples from './support/text_samples'

import {
    array,
    boolean,
    button,
    color,
    date,
    select,
    withKnobs,
    text,
    number,
} from '@storybook/addon-knobs';
import {expDIV} from "./util";

const cloud = require("../index");

export default {
    title: 'Guts | Sprials',
    decorators: [withKnobs],
};


const w = 1200 - 1;
const h = 500 - 1;

export const rectangular = () => {

    const div = expDIV('spiralRectangular', w, h);

    setTimeout(() => {

        const cv = d3.select('#spiralRectangular');
        const rectSpiral = new cloud().testPoints.rectangularSpiral;
        const spiralFunc = rectSpiral([100, 100]);

        const options = {
            range: true,
            min: 1,
            max: 300,
            step: 1,
        };

        const numDots = number('Num dots', 10, options);

        [...Array(numDots).keys()].map(i => {
            const dot = spiralFunc(i);
            cv.append('circle')
                .attr('r', .5)
                .attr('cx', dot[0] + w/16)
                .attr('cy', dot[1] + h/16)
                .attr('fill', 'black')
            ;
        });

    });

    return div;
}

export const archimedian = () => {

    const div = expDIV('spiralArchimedian', w, h);

    setTimeout(() => {

        const cv = d3.select('#spiralArchimedian');
        const archSpiral = new cloud().testPoints.archimedeanSpiral;
        const spiralFunc = archSpiral([w, h]);

        const options = {
            range: true,
            min: 1,
            max: 300,
            step: 1,
        };

        const numDots = number('Num dots', 10, options);

        [...Array(numDots).keys()].map(i => {
            const dot = spiralFunc(i).map(n => n * 4);
            cv.append('circle')
                .attr('r', .2)
                .attr('cx', dot[0] + w/16)
                .attr('cy', dot[1] + h/16)
                .attr('fill', 'black')
            ;
        });

    });

    return div;
}
