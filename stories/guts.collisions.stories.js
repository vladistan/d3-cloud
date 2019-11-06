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
    title: 'Guts | Collisions',
    decorators: [withKnobs],
};

const w = 1200 - 1;
const h = 500 - 1;
const collideRects = new cloud().testPoints.collideRects;
const setupDimensions = new cloud().testPoints.setupDimensions;
const cloudBounds = new cloud().testPoints.cloudBounds;


function alertCollision(cv, coll) {

    cv.append('rect')
        .attr('x', w / 64 * 7)
        .attr('y', 0)
        .attr('width', w / 64)
        .attr('height', h / 64)
        .style('fill', '#303030' )
    ;
    const warn = cv.append('text')
        .text( 'Collision')
        .attr('x', w / 64 * 7 + 2)
        .attr('y', h / 128)
        .attr('fill', 'orange')
        .style('font-size', '4px')
    ;

    return warn;

}

function reconstituteRect(obj) {
    const rect = {};
    const x = obj.x.baseVal.value;
    const width  = obj.width.baseVal.value;
    const y = obj.y.baseVal.value;
    const height  = obj.height.baseVal.value;

    rect.x = x + width/2;
    rect.y = y + height/2;
    setupDimensions(rect, rect.x, rect.y, width, height);

    return rect;
}

export const rectangular = () => {

    const div = expDIV('collisionRandom', w, h);

    // Make sure this bounds always stay inside of the green rect
    const b = [
        {x: 50, y:20},
        {x: 50, y:20}
    ];

    setTimeout(() => {

        const cv = d3.select('#collisionRandom');

        const collWarning =  alertCollision(cv, false);
        collWarning.attr('visibility', 'hidden');

        const bRect = {};
        setupDimensions(bRect, 50, 15, 50, 30);
        bRect.x = bRect.xoff;
        bRect.y = bRect.yoff;

       cv.append('rect')
            .attr('id', 'rectGreen')
            .attr('x', bRect.x)
            .attr('y', bRect.y)
            .attr('width', bRect.width)
            .attr('height', bRect.height)
            .attr('stroke', 'black')
            .attr('fill-opacity', 0.1)
            .style('fill', 'green');

        const greenRect = reconstituteRect(d3.select('#rectGreen')[0][0]);
        cloudBounds(b, greenRect);

        cv.append('rect')
            .attr('id', 'dragRectRed')
            .attr('x', 10)
            .attr('y', 10)
            .attr('width', 30)
            .attr('height', 15)
            .style('fill', 'red');

        const dragHandler = d3.behavior.drag();

        dragHandler.on('drag', function() {
            d3.select(this)
                .attr("x", d3.event.x)
                .attr("y", d3.event.y);

            const a = reconstituteRect(this);
            const coll = collideRects(a, b);
            collWarning.attr('visibility', coll ?  'visible' : 'hidden');

        });

        cv.selectAll('#dragRectRed').call(dragHandler);

    });

    return div;
};

