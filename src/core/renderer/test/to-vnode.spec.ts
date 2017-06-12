import { mockElement, mockDomApi } from '../../../test';
import { toVNode } from '../to-vnode';


describe('toVNode()', function () {
  const domApi = mockDomApi();

  it('should create element w/ child elements and text nodes', function () {
    const elm = mockElement('h1');
    elm.innerHTML = '<div> 1 <span> 2 </span><!--comment-->   </div>';

    const vnode = toVNode(domApi, elm);

    expect(vnode.n).toBe(elm);
    expect(vnode.e).toBe('h1');

    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);

    expect(vnode.h[0].e).toBe('div');

    expect(vnode.h[0].h).toBeDefined();
    expect(vnode.h[0].h.length).toBe(3);

    expect(vnode.h[0].h[0].t).toBe(' 1 ');

    expect(vnode.h[0].h[1].e).toBe('span');
    expect(vnode.h[0].h[2].t).toBe('   ');

    expect(vnode.h[0].h[1].h[0].t).toBe(' 2 ');
  });

  it('should create element w/ child text node', function () {
    const elm = mockElement('h1');
    elm.textContent = '88mph';
    const vnode = toVNode(domApi, elm);
    expect(vnode.n).toBe(elm);
    expect(vnode.e).toBe('h1');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);
    expect(vnode.h[0].t).toBe('88mph');
  });

  it('should create element', function () {
    const elm = mockElement('h1');
    const vnode = toVNode(domApi, elm);
    expect(vnode.n).toBe(elm);
    expect(vnode.e).toBe('h1');
    expect(vnode.h).toBeUndefined();
  });

});
