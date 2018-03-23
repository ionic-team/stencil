import * as d from '../../../declarations';
import { h } from '../h';
import { mockElement, mockRenderer } from '../../../testing/mocks';


describe('event listeners', () => {
  const patch = mockRenderer();
  let elm: any;
  let vnode0: d.VNode;

  beforeEach(() => {
    elm = mockElement('div');
    vnode0 = {};
    vnode0.elm = elm;
  });

  it('attaches click event handler to element', () => {
    const result: any[] = [];

    function clicked(ev: UIEvent) { result.push(ev); }

    const vnode = h('div', { onclick: clicked },
      h('a', null, 'Click my parent')
    );

    elm = patch(vnode0, vnode).elm;
    elm.click();

    expect(result.length).toBe(1);
  });

  it('does not attach new listener', () => {
    const result: any[] = [];

    const vnode1 = h('div', { onclick: () => { result.push(1); } },
      h('a', null, 'Click my parent'),
    );

    const vnode2 = h('div', { onclick: () => { result.push(2); } },
      h('a', null, 'Click my parent'),
    );

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    elm = patch(vnode1, vnode2).elm;
    elm.click();

    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });

  it('detach attached click event handler to element', () => {
    const result: any[] = [];

    function clicked(ev: UIEvent) { result.push(ev); }

    const vnode1 = h('div', { onclick: clicked },
      h('a', null, 'Click my parent'),
    );

    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm.click();

    expect(result.length).toBe(2);

    const vnode2 = h('div', {o: {}},
      h('a', null, 'Click my parent'),
    );

    elm = patch(vnode1, vnode2).elm;
    elm.click();
    elm.click();

    expect(result.length).toBe(2);
  });

  it('shared handlers in parent and child nodes', () => {
    const result: any[] = [];

    function click(ev: any) {
      result.push(ev);
    }

    const vnode1 = h('div', { onclick: click },
      h('a', { onclick: click }, 'Click my parent'),
    );

    elm = patch(vnode0, vnode1).elm;
    elm.click();

    expect(result.length).toBe(1);
    elm.firstChild.click();
    expect(result.length).toBe(3);
  });
});
