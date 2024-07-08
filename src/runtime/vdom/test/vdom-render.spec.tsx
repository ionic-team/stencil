import { isSameVnode } from '../vdom-render';

describe('isSameVnode', () => {
  it('should detect objectively same nodes', () => {
    const vnode1: any = {
      $tag$: 'div',
      $key$: '1',
      $elm$: { nodeType: 9 },
    };
    const vnode2: any = {
      $tag$: 'div',
      $key$: '1',
      $elm$: { nodeType: 9 },
    };
    expect(isSameVnode(vnode1, vnode2)).toBe(true);
  });

  it('should return false in case of hyration', () => {
    const vnode1: any = {
      $tag$: 'slot',
      $key$: '1',
      $elm$: { nodeType: 9 },
      $nodeId$: 1,
    };
    const vnode2: any = {
      $tag$: 'slot',
      $key$: '1',
      $elm$: { nodeType: 9 },
    };
    const vnode3: any = {
      $tag$: 'slot',
      $key$: '1',
      $elm$: { nodeType: 8 },
      $nodeId$: 2,
    };
    expect(isSameVnode(vnode1, vnode2, true)).toBe(false);
    expect(isSameVnode(vnode3, vnode2, true)).toBe(true);
  });
});
