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
    title: 'Guts | Canvas',
    decorators: [withKnobs],
};

const w = 1200 - 1;
const h = 500 - 1;

const testPoints = new cloud().testPoints;
const cloudCanvas = testPoints.cloudCanvas;


function simpleSketch(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(50, 70, 60, 60);

    ctx.beginPath();
    ctx.fillStyle = 'navy';
    ctx.arc(30, 30, 15, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();
    ctx.arc(30, 75, 15, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.stroke();


    ctx.strokeStyle = '#405000';
    ctx.strokeRect(70, 10, 40, 30);

    ctx.beginPath();
    ctx.rect(120, 10, 40, 30);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(170, 10, 40, 30);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(30, 115, 15, 0 *  Math.PI, 1 * Math.PI, true);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(120, 75);
    ctx.arcTo( 200, 75, 200, 90, 20 );
    ctx.arcTo( 200, 135, 175, 150, 20 );
    ctx.arcTo( 135, 140, 40, 155, 20 );
    ctx.closePath();
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(115, 70);
    ctx.lineTo(  205, 70);
    ctx.lineTo(  205, 150);
    ctx.lineTo(  115, 150);
    ctx.closePath();
    ctx.stroke();

}

export const simple = () => {

    const canvas = cloudCanvas();
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = '#eee';

    const ctx = canvas.getContext('2d');

    simpleSketch(ctx);


    return canvas;
};

export const transform = () => {

    const canvas = cloudCanvas();
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = '#eee';

    const ctx = canvas.getContext('2d');
    simpleSketch(ctx);

    ctx.translate(450, 150);
    ctx.rotate( 1 * Math.PI);
    simpleSketch(ctx);


    ctx.translate(-15, -195);
    ctx.rotate( 0.5 * Math.PI);
    simpleSketch(ctx);


    return canvas;
};

export const drawText = () => {

    const canvas = cloudCanvas();
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = '#eee';
    const ctx = canvas.getContext('2d');

    let y = 40;
    for ( const n of [...Array(10).keys()]) {
        const txt = 'Hello';
        ctx.font = (n+5)*4 + 'px Impact';
        ctx.strokeText(txt, 20, y );
        ctx.fillText(txt, 150, y );
        y += ctx.measureText(txt).actualBoundingBoxAscent + 7;
    }


    return canvas;
}

export const textRotate = () => {

    const canvas = cloudCanvas();
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = '#eee';
    const ctx = canvas.getContext('2d');

    ctx.font = '34px Impact';
    ctx.translate(370, 90);

    let y = 40;
    for ( const n of [...Array(6).keys()]) {
        const txt = 'Some text string.';

        ctx.strokeText(txt, 50, 10 );
        ctx.rotate(0.25 * Math.PI);
    }


    return canvas;
}

export const image = () => {

    const canvas = cloudCanvas();
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = '#eee';
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
        console.log('Load');
        ctx.fillStyle = 'green';
        ctx.fillRect(10, 70, 60, 60);

        ctx.drawImage(img, 80, 10, 180, 160);
        ctx.drawImage(img,  180, 160, 60, 60, 280, 10, 180, 160);

        const data = canvas.toDataURL();
        console.log(data);

    };
    img.src = "https://d17fnq9dkz9hgj.cloudfront.net/uploads/2012/11/152964589-welcome-home-new-cat-632x475.jpg";

    ctx.fillStyle = 'red';
    ctx.fillRect(10, 70, 60, 60);


    return canvas;
}

export const dataURL = () => {

    const canvas = cloudCanvas();
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = '#eee';
    const ctx = canvas.getContext('2d');


    simpleSketch(ctx);

    const dataURL = canvas.toDataURL('image/jpeg');

    ctx.strokeText(dataURL, 10, 200);

    return canvas;
}

export const imageProc = () => {

    const canvas = cloudCanvas();
    canvas.width = w;
    canvas.height = h;
    canvas.style.background = '#eee';
    const ctx = canvas.getContext('2d');

    simpleSketch(ctx);

    const pixels = ctx.getImageData(8, 8, 240, 180);
    const pD = pixels.data;
    for ( let i = 0 ; i < pD.length; i +=4 ) {
            const gray = pD[i] * 0.3 + pD[i+1] * .7 + pD[i+2] * .7;

            pD[i] = gray;
            pD[i+1] = gray;
            pD[i+2] = gray;

    }

    for ( const n of [...Array(10).keys()]) {
        ctx.putImageData(pixels, 250 + n * 20, 8 + n * 30) ;
    }

    return canvas;
}
