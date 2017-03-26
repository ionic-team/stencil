import { initRenderer, h } from '../core';
import { eventListenersModule } from '../modules/eventlisteners';
import { PlatformClient } from '../../platform/platform-client';

const document: HTMLDocument = (<any>global).document;

var patch = initRenderer([
  eventListenersModule,
], new PlatformClient(window, document, {}));


describe('event listeners', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('attaches click event handler to element', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode = h('div', {on: {click: clicked}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode).elm;
    elm.click();
    expect(1).toEqual(result.length);
  });
  it('does not attach new listener', function() {
    var result = [];
    //function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: function() { result.push(1); }}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode2 = h('div', {on: {click: function() { result.push(2); }}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    expect(result).toEqual([1, 2]);
  });
  it('does calls handler for function in array', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode = h('div', {on: {click: [clicked, 1]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode).elm;
    elm.click();
    expect(result).toEqual([1]);
  });
  it('handles changed value in array', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: [clicked, 1]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode2 = h('div', {on: {click: [clicked, 2]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode3 = h('div', {on: {click: [clicked, 3]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    elm = patch(vnode2, vnode3).elm;
    elm.click();
    expect(result).toEqual([1, 2, 3]);
  });
  it('handles changed several values in array', function() {
    var result = [];
    function clicked() { result.push([].slice.call(arguments, 0, arguments.length-2)); }
    var vnode1 = h('div', {on: {click: [clicked, 1, 2, 3]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode2 = h('div', {on: {click: [clicked, 1, 2]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode3 = h('div', {on: {click: [clicked, 2, 3]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    elm = patch(vnode2, vnode3).elm;
    elm.click();
    expect(result).toEqual([[1, 2, 3], [1, 2], [2, 3]]);
  });
  it('detach attached click event handler to element', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: clicked}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    expect(1).toEqual(result.length);
    var vnode2 = h('div', {on: {}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    expect(1).toEqual(result.length);
  });
  it('multiple event handlers for same event on same element', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: [[clicked], [clicked], [clicked]]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    expect(3).toEqual(result.length);
    var vnode2 = h('div', {on: {click: [[clicked], [clicked]]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    expect(5).toEqual(result.length);
  });
  it('access to virtual node in event handler', function() {
    var result = [];
    function clicked(ev, vnode) {
      ev;
      result.push(this); result.push(vnode);
    }
    var vnode1 = h('div', {on: {click: clicked }}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    expect(2).toEqual(result.length);
    expect(vnode1).toEqual(result[0]);
    expect(vnode1).toEqual(result[1]);
  }),
  it('access to virtual node in event handler with argument', function() {
    var result = [];
    function clicked(arg, ev, vnode) {
      arg; ev;
      result.push(this); result.push(vnode);
    }
    var vnode1 = h('div', {on: {click: [clicked, 1] }}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    expect(2).toEqual(result.length);
    expect(vnode1).toEqual(result[0]);
    expect(vnode1).toEqual(result[1]);
  }),
  it('access to virtual node in event handler with arguments', function() {
    var result = [];
    function clicked(arg1, arg2, ev, vnode) {
      arg1; arg2; ev;
      result.push(this); result.push(vnode);
    }
    var vnode1 = h('div', {on: {click: [clicked, 1, "2"] }}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    expect(2).toEqual(result.length);
    expect(vnode1).toEqual(result[0]);
    expect(vnode1).toEqual(result[1]);
  });
  it('shared handlers in parent and child nodes', function() {
    var result = [];
    var sharedHandlers = {
      click: function(ev) { result.push(ev); }
    };
    var vnode1 = h('div', {on: sharedHandlers}, [
      h('a', {on: sharedHandlers}, 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    expect(1).toEqual(result.length);
    elm.firstChild.click();
    expect(3).toEqual(result.length);
  });
});
