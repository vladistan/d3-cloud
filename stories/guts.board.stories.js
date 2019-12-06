import {action} from '@storybook/addon-actions';
import * as samples from './support/text_samples'
import {expDIV, getCanvas, unrollNum} from "./util";
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

function displayBoard(cv, board, w, h) {

    const sw = w / 32;

    let idx = 0;

    cv.strokeStyle = '#405000';
    cv.lineWidth = .5;

    for (let y = 0; y < h; y++) {
        let col = 0;
        for (let x = 0; x < sw; x++) {
            const s = unrollNum(board[idx++]);
            for (let i of s) {
                if (!i) {
                    cv.strokeRect((col++) * 5 + 7, y * 5 + 4, 4, 4);
                } else {
                    cv.fillRect((col++) * 5 + 7, y * 5 + 4, 4, 4);
                }
            }
        }
    }
}

export const blankBoard = () => {

    const lcnv = getCanvas(w, h);
    const cv = lcnv.getContext('2d');

    const size = [128, 64];
    const board = zeroArray((size[0] >> 5) * size[1]);

    displayBoard(cv, board, 128, 128);


    return lcnv;
};

export const withSquare = () => {

    const lcnv = getCanvas(w, h);
    const cv = lcnv.getContext('2d');

    const size = [128, 64];
    const board = zeroArray((size[0] >> 5) * size[1]);

    for (let i = 0; i < 8; i++) {
        board[(12 + i) * 4 + 1] = 0xffff;
        board[(12 + i) * 4 + 2] = 0xffff0000;
    }

    displayBoard(cv, board, 128, 64);
    return lcnv;
};

export const placeOne = () => {

    const lcnv = getCanvas(w, h);
    const cv = lcnv.getContext('2d');


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


    return lcnv;

};

export const placeMultiple = () => {

    const lcnv = getCanvas(w, h);
    const cv = lcnv.getContext('2d');

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

    for (const d of data) {
        cld.testPoints.cloudSprite(ctx, d, data, 0);
        cld.testPoints.place(board, d, bounds);
    }

    displayBoard(cv, board, size[0], size[1]);


    return lcnv;

};





