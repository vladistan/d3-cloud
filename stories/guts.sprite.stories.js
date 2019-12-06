import {action} from '@storybook/addon-actions';
import * as samples from './support/text_samples'
import {expDIV, unrollNum} from "./util";
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

const cloud = require("../index");

export default {
    title: 'Guts | Sprite',
    decorators: [withKnobs],
};

const w = 1200 - 1;
const h = 500 - 1;
let cld = new cloud();
let testPoints = cld.testPoints;
const setupDimensions = testPoints.setupDimensions;
const cloudBounds = testPoints.cloudBounds;

function displaySprite(cv, d, xoff, yoff) {

    const sprite = d.sprite;
    const sw = d.width;
    let idx = 0;
    for (let n = 0; n < sprite.length / (d.width / 32); n++) {
        let col = 0;
        for (let x = 0; x < d.width / 32; x++) {
            const s = unrollNum(sprite[idx++]);
            cv.append('g')
                .selectAll("circle")
                .data(s)
                .enter()
                .append('circle')
                .attr('cx', (d, i) => (col++) * .7 + 2 + xoff)
                .attr('cy', 4 + n * 1 + yoff)
                .attr('r', (d, i) => d/2.5+0.05);
        }
    }
}

function displayLabel(cv, d, text, line) {
    cv.append('text')
        .text(text)
        .attr('x', w / 64 * 7 + 2)
        .attr('y', h / 128 * line)
        .style('font-size', '3px');
}


export const simplestCase = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');

        const canvas = cld.canvas()();
        const ctx = cld.testPoints.getContext(canvas);

        const attrs = {font: 'Impact', padding: 0, size: 2, weight: 'light', style: 'normal'};


        const data = [
            Object.assign({text: '.'}, attrs),
        ];

        const d = data[0];

        const s = cld.testPoints.cloudSprite(ctx, d, data, 0);

        console.log(d.sprite);

        displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);
        displayLabel(cv, d, `Width ${d.width}`, 2);
        displayLabel(cv, d, `Height ${d.height}`, 3);
        displayLabel(cv, d, `Len ${d.sprite.length}`, 4);

        displaySprite(cv, data[0], 0, 10);

    });


    return div;
};

export const simpleCaseFlipped = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');

        const canvas = cld.canvas()();
        const ctx = cld.testPoints.getContext(canvas);

        const attrs = {font: 'Impact', padding: 0, size: 2, weight: 'light', style: 'normal'};


        const data = [
            Object.assign({text: '.', rotate: 180}, attrs),
        ];

        const d = data[0];

        const s = cld.testPoints.cloudSprite(ctx, d, data, 0);

        console.log(d.sprite);

        displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);
        displayLabel(cv, d, `Width ${d.width}`, 2);
        displayLabel(cv, d, `Height ${d.height}`, 3);
        displayLabel(cv, d, `Len ${d.sprite.length}`, 4);

        displaySprite(cv, data[0], 0, 10);

    });


    return div;
};

export const largeWord = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');

        const canvas = cld.canvas()();
        const ctx = cld.testPoints.getContext(canvas);

        const attrs = {font: 'Helvetica', padding: 0, size: 24, weight: 'light', style: 'normal'};


        const data = [
            Object.assign({text: 'Lorem ipsum dolor sit amet'}, attrs),
        ];

        const d = data[0];

        const s = cld.testPoints.cloudSprite(ctx, d, data, 0);


        displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);
        displayLabel(cv, d, `Width ${d.width}`, 2);
        displayLabel(cv, d, `Height ${d.height}`, 3);
        displayLabel(cv, d, `Len ${d.sprite.length}`, 4);

        displaySprite(cv, data[0], 0, 10);

    });


    return div;
};

export const tinyWords = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');
        const yoff = [10, 26, 42];

        const canvas = cld.canvas()();
        const ctx = cld.testPoints.getContext(canvas);
        const attrs = {font: 'Verdana', padding: 0, size: 8, weight: 'normal', style: 'normal'};

        const data = [
            Object.assign({text: 'J_,.                ^'}, attrs),
            Object.assign({text: 'There'}, attrs),
            Object.assign({text: 'Comma, Under_'}, attrs),
            Object.assign({text: 'Lorem Ipsum'}, attrs),
            Object.assign({text: '.          .        .'}, attrs),
            Object.assign({text: '.         `.`        .'}, attrs),
        ];

        const d = data[0];
        cld.testPoints.cloudSprite(ctx, d, data, 0);


        displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);

        for  (let n = 0 ; n < 6 ; n ++ ) {
            displaySprite(cv, data[n], n < 3 ?  0 : 80, yoff[n % yoff.length]);
        }

    });


    return div;
};

export const rotate = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');
        const yoff = [10];

        const canvas = cld.canvas()();
        const ctx = cld.testPoints.getContext(canvas);
        const attrs = {font: 'Verdana', padding: 0, size: 28, weight: 'light', style: 'normal'};

        const data = [
            Object.assign({text: 'There', rotate: 45}, attrs),
            Object.assign({text: 'There', rotate: -45}, attrs),
        ];

        const d = data[0];
        cld.testPoints.cloudSprite(ctx, d, data, 0);


        displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);

        for  (let n = 0 ; n < 6 ; n ++ ) {
            displaySprite(cv, data[n], n < 1 ?  0 : 80, yoff[n % yoff.length]);
        }

    });


    return div;
};

