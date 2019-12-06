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
    title: 'Guts | Board',
    decorators: [withKnobs],
};

const w = 1200 - 1;
const h = 500 - 1;
let cld = new cloud();
let testPoints = cld.testPoints;

const zeroArray = testPoints.zeroArray;


function unrollNum(n) {

    const rv = [];
    for (let i = 0; i < 32; i++) {
        rv[32 - i] = n & (1) ? 1 : 0;
        n = n >> 1;
    }

    return rv;
}

function displayBoard(cv, board, w, h) {

    const sw = w / 32;

    let idx = 0;
    for (let y = 0; y < h; y++) {
        let col = 0;
        for (let x = 0; x < sw; x++) {
            const s = unrollNum(board[idx++]);
            cv.append('g')
                .selectAll("circle")
                .data(s)
                .enter()
                .append('circle')
                .attr('cx', (d, i) => (col++) * .4 + 2)
                .attr('cy', 4 + y * .4)
                .attr('r', (d, i) => d / 6 + 0.05);
        }
    }
}

export const blankBoard = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');
        const size = [128, 64];
        const board = zeroArray((size[0] >> 5) * size[1]);

        displayBoard(cv, board, 128, 128);
    });

    return div;
};


export const withSquare = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');
        const size = [128, 64];
        const board = zeroArray((size[0] >> 5) * size[1]);

        for (let i = 0; i < 8; i++) {
            board[(12 + i) * 4 + 1] = 0xffff;
            board[(12 + i) * 4 + 2] = 0xffff0000;
        }

        displayBoard(cv, board, 128, 64);
    });


    return div;
};

export const placeOne = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {


        const cv = d3.select('#spriteExplore');

        const canvas = cld.canvas()();
        const ctx = cld.testPoints.getContext(canvas);
        const size = [64, 16];
        const board = zeroArray((size[0] >> 5) * size[1]);
        const bounds = [{x: 0, y: 0}, {x: size[0], y: size[1]}];

        cld.size(size);


        const attrs = {font: 'Impact', padding: 0, size: 4, weight: 'light', style: 'normal'};

        const data = [
            Object.assign({text: '!', x: 16, y: 10, rotate: 0}, attrs),
        ];

        cld.testPoints.cloudSprite(ctx, data[0], data, 0);
        cld.testPoints.place(board, data[0], bounds);

        displayBoard(cv, board, size[0], size[1]);

    });

    return div;

};


export const placeMultiple = () => {

    const div = expDIV('spriteExplore', w, h);

    setTimeout(() => {

        const cv = d3.select('#spriteExplore');

        const canvas = cld.canvas()();
        const ctx = cld.testPoints.getContext(canvas);
        const size = [96, 40];
        const board = zeroArray((size[0] >> 5) * size[1]);
        const bounds = [{x: 0, y: 0}, {x: size[0], y: size[1]}];

        cld.size(size);

        const attrs = {font: 'Impact', padding: 0, size: 10, weight: 'light', style: 'normal'};

        const data = [
            Object.assign({text: 'Hello', x: 0, y: 0, rotate: -45}, attrs),
            Object.assign({text: 'More', x: 0, y: 0, rotate: 45}, attrs),
            Object.assign({text: 'Doh!', x: 0, y: 0, rotate: 0}, attrs),
            Object.assign({text: 'There', x: 0, y: 0, rotate: 90}, attrs),
        ];

        for (const d of data ) {
            cld.testPoints.cloudSprite(ctx, d, data, 0);
            cld.testPoints.place(board, d, bounds);
        }

        displayBoard(cv, board, size[0], size[1]);

    });

    return div;

};





