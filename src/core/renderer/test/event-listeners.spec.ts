import { h } from '../h';
import { mockRenderer, mockElement } from '../../../testing/mocks';
import { VNode } from '../vnode';


describe('event listeners', () => {
  const patch = mockRenderer();
  let elm: any;
  let vnode0: any;

  beforeEach(() => {
    elm = mockElement('div');
    vnode0 = new VNode();
    vnode0.elm = elm;
  });

  it('attaches click event handler to element', () => {
    const result: any[] = [];

    function clicked(ev: UIEvent) { result.push(ev); }

    var vnode = h('div', { o: {click: clicked} }, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode).elm;
    elm.click();

    expect(result.length).toBe(1);
  });

  it('does not attach new listener', () => {
    const result: any[] = [];

    var vnode1 = h('div', {o: {click: () => { result.push(1); }}}, [
      h('a', 'Click my parent'),
    ]);

    var vnode2 = h('div', {o: {click: () => { result.push(2); }}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    elm = patch(vnode1, vnode2).elm;
    elm.click();

    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });

  it('does calls handler for function in array', () => {
    const result: any[] = [];

    function clicked(ev: UIEvent) { result.push(ev); }

    var vnode = h('div', {o: {click: [clicked, 1]}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode).elm;
    elm.click();

    expect(result[0]).toBe(1);
  });

  it('handles changed value in array', () => {
    const result: any[] = [];

    function clicked(ev: UIEvent) { result.push(ev); }

    var vnode1 = h('div', {o: {click: [clicked, 1]}}, [
      h('a', 'Click my parent'),
    ]);

    var vnode2 = h('div', {o: {click: [clicked, 2]}}, [
      h('a', 'Click my parent'),
    ]);

    var vnode3 = h('div', {o: {click: [clicked, 3]}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    elm = patch(vnode1, vnode2).elm;
    elm.click();

    elm = patch(vnode2, vnode3).elm;
    elm.click();

    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(3);
  });

  it('handles changed several values in array', () => {
    const result: any[] = [];

    function clicked() { result.push([].slice.call(arguments, 0, arguments.length - 2)); }

    var vnode1 = h('div', {o: {click: [clicked, 1, 2, 3]}}, [
      h('a', 'Click my parent'),
    ]);

    var vnode2 = h('div', {o: {click: [clicked, 1, 2]}}, [
      h('a', 'Click my parent'),
    ]);

    var vnode3 = h('div', {o: {click: [clicked, 2, 3]}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    elm = patch(vnode1, vnode2).elm;
    elm.click();

    elm = patch(vnode2, vnode3).elm;
    elm.click();

    expect(result[0][0]).toBe(1);
    expect(result[0][1]).toBe(2);
    expect(result[0][2]).toBe(3);

    expect(result[1][0]).toBe(1);
    expect(result[1][1]).toBe(2);

    expect(result[2][0]).toBe(2);
    expect(result[2][1]).toBe(3);
  });

  it('detach attached click event handler to element', () => {
    const result: any[] = [];

    function clicked(ev: UIEvent) { result.push(ev); }

    var vnode1 = h('div', {o: {click: clicked}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm.click();

    expect(result.length).toBe(2);

    var vnode2 = h('div', {o: {}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode1, vnode2).elm;
    elm.click();
    elm.click();

    expect(result.length).toBe(2);
  });

  it('multiple event handlers for same event on same element', () => {
    const result: any[] = [];

    function clicked(ev: UIEvent) { result.push(ev); }

    var vnode1 = h('div', {o: {click: [[clicked], [clicked], [clicked]]}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    expect(result.length).toBe(3);

    var vnode2 = h('div', {o: {click: [[clicked], [clicked]]}}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode1, vnode2).elm;
    elm.click();

    expect(result.length).toBe(5);
  });

  it('access to virtual node in event handler', () => {
    const result: any[] = [];
    let testEv: any = null;

    function clicked(ev: any, vnode: any) {
      testEv = ev;
      result.push(ev);
      result.push(this);
      result.push(vnode);
    }

    var vnode1 = h('div', {o: {click: clicked }}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    expect(result.length).toBe(3);

    expect(testEv).toBe(result[0]);
    expect(vnode1).toBe(result[1]);
    expect(vnode1).toBe(result[2]);
  });

  it('access to virtual node in event handler with argument', () => {
    const result: any[] = [];
    let testEv: any = null;

    function clicked(arg: any, ev: any, vnode: any) {
      testEv = ev;
      result.push(arg);
      result.push(ev);
      result.push(this);
      result.push(vnode);
    }

    var vnode1 = h('div', {o: {click: [clicked, 'my-arg'] }}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    expect(result.length).toBe(4);

    expect('my-arg').toBe(result[0]);
    expect(testEv).toBe(result[1]);
    expect(vnode1).toBe(result[2]);
    expect(vnode1).toBe(result[3]);
  });

  it('access to virtual node in event handler with arguments', () => {
    const result: any[] = [];
    let testEv: any = null;

    function clicked(arg1: any, arg2: any, ev: any, vnode: any) {
      testEv = ev;
      result.push(arg1);
      result.push(arg2);
      result.push(ev);
      result.push(this);
      result.push(vnode);
    }

    var vnode1 = h('div', {o: {click: [clicked, 88, 'mph'] }}, [
      h('a', 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    expect(result.length).toBe(5);

    expect(88).toBe(result[0]);
    expect('mph').toBe(result[1]);
    expect(testEv).toBe(result[2]);
    expect(vnode1).toBe(result[3]);
    expect(vnode1).toBe(result[4]);
  });

  it('shared handlers in parent and child nodes', () => {
    const result: any[] = [];

    var sharedHandlers = {
      click: function(ev: any) {
        result.push(ev);
      }
    };

    var vnode1 = h('div', {o: sharedHandlers}, [
      h('a', {o: sharedHandlers}, 'Click my parent'),
    ]);

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    expect(result.length).toBe(1);
    elm.firstChild.click();
    expect(result.length).toBe(3);
  });

});
