import { mockElement, mockDomApi } from '../../../testing/mocks';
import { toVNode } from '../to-vnode';


describe('toVNode()', () => {
  const domApi = mockDomApi();

  it('should create element w/ child elements and text nodes', () => {
    const elm = mockElement('h1');
    elm.innerHTML = '<div> 1 <span> 2 </span><!--comment-->   </div>';

    const vnode = toVNode(domApi, elm);

    expect(vnode.elm).toBe(elm);
    expect(vnode.vtag).toBe('h1');

    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(1);

    expect(vnode.vchildren[0].vtag).toBe('div');

    expect(vnode.vchildren[0].vchildren).toBeDefined();
    expect(vnode.vchildren[0].vchildren.length).toBe(3);

    expect(vnode.vchildren[0].vchildren[0].vtext).toBe(' 1 ');

    expect(vnode.vchildren[0].vchildren[1].vtag).toBe('span');
    expect(vnode.vchildren[0].vchildren[2].vtext).toBe('   ');

    expect(vnode.vchildren[0].vchildren[1].vchildren[0].vtext).toBe(' 2 ');
  });

  it('should create element w/ child text node', () => {
    const elm = mockElement('h1');
    elm.textContent = '88mph';
    const vnode = toVNode(domApi, elm);
    expect(vnode.elm).toBe(elm);
    expect(vnode.vtag).toBe('h1');
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(1);
    expect(vnode.vchildren[0].vtext).toBe('88mph');
  });

  it('should create element', () => {
    const elm = mockElement('h1');
    const vnode = toVNode(domApi, elm);
    expect(vnode.elm).toBe(elm);
    expect(vnode.vtag).toBe('h1');
    expect(vnode.vchildren).toBeUndefined();
  });

});
