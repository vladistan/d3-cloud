import {action} from '@storybook/addon-actions';
import * as samples from './support/text_samples'
import {expDIV} from "./util";
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
    title: 'Guts | Sprite (Canvas)',
    decorators: [withKnobs],
};

const w = 1200 - 1;
const h = 500 - 1;
let cld = new cloud();
const testPoints = new cloud().testPoints;
const cloudCanvas = testPoints.cloudCanvas;


function unrollNum(n) {

    const rv = [];
    for (let i = 0; i < 32; i++) {
        rv[32 - i] = n & (1) ? 1 : 0;
        n = n >> 1;
    }

    return rv;
}

function displaySprite(cv, d, xoff, yoff) {

    const sprite = d.sprite;
    const sw = d.width;
    let idx = 0;

    cv.strokeStyle = '#405000';
    cv.lineWidth = .5;

    for (let n = 0; n < sprite.length / (d.width / 32); n++) {
        let col = 0;
        for (let x = 0; x < d.width / 32; x++) {
            const s = unrollNum(sprite[idx++]);
            for (let i of s) {
                if (!i) {
                    cv.strokeRect((col++) * 5 + xoff, n * 5 + yoff, 4, 4);
                } else {
                    cv.fillRect((col++) * 5 + xoff, n * 5 + yoff, 4, 4);
                }

            }
        }
    }
}

function displayLabel(ctx, d, text, line) {
    ctx.font = 14 + 'px Verdana';
    ctx.fillText(text, w - w / 8, 20 * line);
}

function getCanvas() {
    const lcnv = cloudCanvas();
    lcnv.width = w;
    lcnv.height = h;
    lcnv.style.background = '#eee';
    return lcnv;
}

export const simplestCase = () => {

    const lcnv = getCanvas();
    const cv = lcnv.getContext('2d');

    const canvas = cld.canvas()();
    const ctx = cld.testPoints.getContext(canvas);

    const attrs = {font: 'Impact', padding: 0, size: 2, weight: 'light', style: 'normal'};
    const data = [
        Object.assign({text: '.'}, attrs),
    ];
    const d = data[0];
    const s = cld.testPoints.cloudSprite(ctx, d, data, 0);

    console.log(d.sprite);

    displaySprite(cv, data[0], 20, 10);

    displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);
    displayLabel(cv, d, `Width ${d.width}`, 2);
    displayLabel(cv, d, `Height ${d.height}`, 3);
    displayLabel(cv, d, `Len ${d.sprite.length}`, 4);

    return lcnv;

};

export const simplestCaseFlipped = () => {

    const lcnv = getCanvas();
    const cv = lcnv.getContext('2d');

    const canvas = cld.canvas()();
    const ctx = cld.testPoints.getContext(canvas);

    const attrs = {font: 'Impact', padding: 0, size: 2, weight: 'light', style: 'normal'};
    const data = [
        Object.assign({text: '.', rotate: 180}, attrs),
    ];
    const d = data[0];
    const s = cld.testPoints.cloudSprite(ctx, d, data, 0);

    console.log(d.sprite);


    displaySprite(cv, data[0], 20, 10);

    displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);
    displayLabel(cv, d, `Width ${d.width}`, 2);
    displayLabel(cv, d, `Height ${d.height}`, 3);
    displayLabel(cv, d, `Len ${d.sprite.length}`, 4);

    return lcnv;

};

export const largeWord = () => {

    const lcnv = getCanvas();
    const cv = lcnv.getContext('2d');

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

    displaySprite(cv, data[0], 90, 50);


    return lcnv;
};

export const tinyWords = () => {

    const lcnv = getCanvas();
    const cv = lcnv.getContext('2d');

    const canvas = cld.canvas()();
    const ctx = cld.testPoints.getContext(canvas);

    const yoff = [10, 142, 342];

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

    for (let n = 0; n < 6; n++) {
        displaySprite(cv, data[n], n < 3 ? 0 : w / 2 - 50, yoff[n % yoff.length]);
    }


    return lcnv;
};

export const rotate = () => {

    const lcnv = getCanvas();
    const cv = lcnv.getContext('2d');

    const canvas = cld.canvas()();
    const ctx = cld.testPoints.getContext(canvas);

    const yoff = [10];

    const attrs = {font: 'Verdana', padding: 0, size: 28, weight: 'light', style: 'normal'};

    const data = [
        Object.assign({text: 'There', rotate: 45}, attrs),
        Object.assign({text: 'There', rotate: -45}, attrs),
    ];

    const d = data[0];
    cld.testPoints.cloudSprite(ctx, d, data, 0);

    displayLabel(cv, d, `Ratio ${ctx.ratio}`, 1);

    for (let n = 0; n < 2; n++) {
        displaySprite(cv, data[n], n < 1 ? 0 : 380, yoff[n % yoff.length]);
    }


    return lcnv;
};

