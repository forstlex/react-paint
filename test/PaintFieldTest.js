/* global expect, describe,it */
/* eslint no-console: 0 */
/* eslint-env node */

import React from 'react';
import {mount} from 'enzyme';
import PaintField from '../src/PaintField';

function objectFromDrag(canvas, from = { x: 0, y: 0 }, to = { x: 10, y: 10 }, id) {
  function MouseEventPositionGenerator(pos = { x: 0, y: 0 }) {
    const eventX = ['x', 'pageX', 'screenX', 'clientX', 'offsetX'];
    const eventY = ['y', 'pageY', 'screenY', 'clientY', 'offsetY'];
    const generated = {};
    eventX.forEach(key => (generated[key] = pos.x));
    eventY.forEach(key => (generated[key] = pos.y));
    return generated;
  }

  canvas.trigger('mouse:down', { e: MouseEventPositionGenerator(from) });
  canvas.trigger('mouse:move', { e: MouseEventPositionGenerator(to) });
  canvas.trigger('mouse:up', { e: MouseEventPositionGenerator(to) });
  // Get the last object as the last created object
  const objects = canvas.getObjects();
  const newObj = objects[objects.length - 1];
  id && (newObj.id = id);
  return newObj;
}

describe('PaintField', () => {
  it('Loads Normally', () => {
    require('../src/PaintField');
  });

  it('Contains canvas tag', () => {
    const paint = mount(<PaintField/>);
    expect(paint.getDOMNode('canvas')).toBeDefined();
  });

  it('Drag to create rectangle', () => {
    const paint = mount(<PaintField tool="rectangle"/>);
    const canvas = paint.instance()._fc;
    expect(canvas).toBeDefined();

    const startPt = { x: 10, y: 10 };
    const endPt = { x: 40, y: 50 };
    const bounding = {
      left: startPt.x,
      top: startPt.y,
      width: endPt.x - startPt.x,
      height: endPt.y - startPt.y,
    };

    // From left-top to right-bottom
    objectFromDrag(canvas, startPt, endPt);

    // Check the rectangle existed
    expect(canvas.getObjects()[0]).toBeDefined();
    const rect1 = canvas.getObjects()[0];
    expect(rect1.type).toEqual('rect');

    // Check the rectangle dimension
    expect({
      left: rect1.left,
      top: rect1.top,
      width: rect1.width,
      height: rect1.height,
    }).toEqual(bounding);

    canvas.remove(rect1);
    // From right-bottom to left-top;
    objectFromDrag(canvas, endPt, startPt);
    const rect2 = canvas.getObjects()[0];
    expect(rect2.type).toEqual('rect');

    // Check the rectangle dimension
    expect({
      left: rect2.left,
      top: rect2.top,
      width: rect2.width,
      height: rect2.height,
    }).toEqual(bounding);
  });

  it('Undo/Redo for multiple rectangles add to canvas', () => {
    const paint = mount(<PaintField tool="rectangle"/>).instance();
    const canvas = paint._fc;
    expect(canvas).toBeDefined();

    const startPt = { x: 10, y: 10 };
    const endPt = { x: 40, y: 50 };

    canvas.renderOnAddRemove = false;
    objectFromDrag(canvas, startPt, endPt, 'rect1');
    objectFromDrag(canvas, startPt, endPt, 'rect2');
    expect(canvas.getObjects().map(o => o.id)).toEqual(['rect1', 'rect2']);

    paint.undo();
    expect(canvas.getObjects().map(o => o.id)).toEqual(['rect1']);

    paint.undo();
    expect(canvas.getObjects().map(o => o.id)).toEqual([]);

    paint.redo();
    expect(canvas.getObjects().map(o => o.id)).toEqual(['rect1']);

    objectFromDrag(canvas, startPt, endPt, 'rect3');
    expect(canvas.getObjects().map(o => o.id)).toEqual(['rect1', 'rect3']);

    paint.undo();
    expect(canvas.getObjects().map(o => o.id)).toEqual(['rect1']);
  });

  it('Undo/Redo for multiple modification for single rectangle', () => {
    const paint = mount(<PaintField tool="rectangle"/>).instance();
    const canvas = paint._fc;
    expect(canvas).toBeDefined();

    const startPt = { x: 10, y: 10 };
    const endPt = { x: 40, y: 50 };

    // [Action1] Add new rectange object and save its state
    const stateStack = [];
    const rect = objectFromDrag(canvas, startPt, endPt);
    stateStack.push(rect.toJSON());

    // [Action2] Change rectangle dimension and save its state
    rect.set({ width: 50, height: 60 });
    rect.setCoords();
    canvas.trigger('object:modified', { target: rect });
    stateStack.push(rect.toJSON());

    // [Action3] Change the position and save its state
    rect.set({ left: 20, top: 70 });
    rect.setCoords();
    canvas.trigger('object:modified', { target: rect });
    stateStack.push(rect.toJSON());

    // Undo Action3
    paint.undo();
    void (function() {
      const obj = canvas.getObjects()[0];
      expect(obj.toJSON()).toEqual(stateStack[1]);
    })();

    // Undo Action2
    paint.undo();
    void (function() {
      const obj = canvas.getObjects()[0];
      expect(obj.toJSON()).toEqual(stateStack[0]);
    })();

    // Undo Action1, and then redo Action1
    paint.undo();
    paint.redo();
    void (function() {
      const obj = canvas.getObjects()[0];
      expect(obj.toJSON()).toEqual(stateStack[0]);
    })();

    // redo Action2
    paint.redo();
    void (function() {
      const obj = canvas.getObjects()[0];
      expect(obj.toJSON()).toEqual(stateStack[1]);
    })();

    // redo Action3
    paint.redo();
    void (function() {
      const obj = canvas.getObjects()[0];
      expect(obj.toJSON()).toEqual(stateStack[2]);
    })();
  });

  it('Removes selected object', () => {
    const paint = mount(<PaintField tool="rectangle"/>).instance();
    const canvas = paint._fc;
    expect(canvas).toBeDefined();

    const startPt = { x: 10, y: 10 };
    const endPt = { x: 40, y: 50 };

    canvas.renderOnAddRemove = false;
    objectFromDrag(canvas, startPt, endPt, 'rect1');
    objectFromDrag(canvas, startPt, endPt, 'rect2');
    canvas.setActiveObject(canvas.getObjects()[0]);

    paint.removeSelected();
    expect(canvas.getObjects().map(o => o.id)).toEqual(['rect2']);

    paint.undo();
    expect(canvas.getObjects().map(o => o.id)).toEqual(['rect2', 'rect1']);
  });

  it('Copy/Paste selected object', () => {
    const paint = mount(<PaintField tool="rectangle"/>).instance();
    const canvas = paint._fc;
    expect(canvas).toBeDefined();

    const startPt = { x: 10, y: 10 };
    const endPt = { x: 40, y: 50 };

    canvas.renderOnAddRemove = false;
    objectFromDrag(canvas, startPt, endPt, 'rect1');
    objectFromDrag(canvas, startPt, endPt, 'rect2');
    canvas.setActiveObject(canvas.getObjects()[0]);

    expect(canvas.getObjects().length).toEqual(2);

    paint.copy();
    paint.paste();

    expect(canvas.getObjects().length).toEqual(3);
  });
});
