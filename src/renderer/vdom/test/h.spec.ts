import * as d from '../../../declarations';
import { h } from '../h';
import { FunctionalComponent } from '../../../declarations';


describe('h()', () => {

  it('should render nested functional components', () => {
    const FunctionalCmp1 = () => h('fn-cmp', null);
    const FunctionalCmp2 = () => h(FunctionalCmp1, null);
    const vnode = h(FunctionalCmp2, null);
    expect(vnode.vtag).toEqual('fn-cmp');
  });

  it('should render functional component', () => {
    const FunctionalCmp = () => h('fn-cmp', null);
    const vnode = h(FunctionalCmp, null);
    expect(vnode.vtag).toEqual('fn-cmp');
  });

  it('should get vnode with only tag string', () => {
    const vnode = h('div', null);
    expect(vnode.vtag).toEqual('div');
  });

  it('should get vnode with tag and data', () => {
    const vnode = h('div', { id: 'my-id' });
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.id).toBe('my-id');
  });

  it('should get vnode with tag and child text', () => {
    const vnode = h('div', null, 'child text');
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toBe('child text');
  });

  it('should get vnode with tag and multiple child text', () => {
    const vnode = h('div', null, 'child 1', 'child 2');
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toBe('child 1child 2');
  });

  it('should get vnode with tag and child number', () => {
    const vnode = h('div', null, 0);
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toBe('0');
  });

  it('should get vnode with tag with multiple child h()', () => {
    const vnode = h('div', null, h('child-a', null), h('child-b', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(2);
    expect(vnode.vchildren[0].vtag).toBe('child-a');
    expect(vnode.vchildren[1].vtag).toBe('child-b');
  });

  it('should get vnode with tag with one child h()', () => {
    const vnode = h('parent', null, h('child', null));
    expect(vnode.vtag).toEqual('parent');
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(1);
    expect(vnode.vchildren[0].vtag).toBe('child');
  });

  it('should get vnode with tag with two child h()', () => {
    const vnode = h('parent', null, h('child-a', null), h('child-b', null));
    expect(vnode.vtag).toEqual('parent');
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(2);
    expect(vnode.vchildren[0].vtag).toBe('child-a');
    expect(vnode.vchildren[1].vtag).toBe('child-b');
  });

  it('should get vnode with tag, data, child text', () => {
    const vnode = h('div', { id: 'my-id' }, 'child text');
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vchildren[0].vtext).toBe('child text');
  });

  it('should get vnode with tag, data, child number', () => {
    const vnode = h('div', { id: 'my-id' }, 0);
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vchildren[0].vtext).toBe('0');
  });

  it('should get vnode with tag, data, one child h()', () => {
    const vnode = h('div', { id: 'my-id' }, h('child-a', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(1);
    expect(vnode.vchildren[0].vtag).toBe('child-a');
  });

  it('should get vnode with tag, data, array of children h()', () => {
    const vnode = h('div', { id: 'my-id' },
      h('child-a', null),
      h('child-b', null)
    );
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(2);
    expect(vnode.vchildren[0].vtag).toBe('child-a');
    expect(vnode.vchildren[1].vtag).toBe('child-b');
  });

  it('should have class exactly as passed if string w/ extra whitespace', () => {
    const vnode = h('div', { class: '  dragons   love  tacos  ' });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class).toEqual('  dragons   love  tacos  ');
  });

  it('should have class exactly as passed if string w/ duplicates', () => {
    const vnode = h('div', { class: 'middle aligned center aligned' });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class).toEqual('middle aligned center aligned');
  });

  it('should have class based on classes as keys of an object', () => {
    const vnode = h('div', { class: { 'dragons': true, 'love': true, 'tacos': true } });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class).toEqual('dragons love tacos');
  });

  it('should set vkey', () => {
    const vnode = h('div', { key: 'my-key' });
    expect(vnode.vkey).toBe('my-key');
  });

  it('should set vkey to undefined when key is undefined', () => {
    const vnode = h('div', { key: undefined });
    expect(vnode.vkey).toBe(undefined);
  });

  it('should set vkey to undefined when key is null', () => {
    const vnode = h('div', { key: null });
    expect(vnode.vkey).toBe(undefined);
  });

  it('should set vkey to undefined when we have data, but no key', () => {
    const vnode = h('div', { some: 'data' });
    expect(vnode.vkey).toBe(undefined);
  });

  it('should set vkey to undefined when no data', () => {
    const vnode = h('div', null);
    expect(vnode.vkey).toBe(undefined);
  });

  it('should set vattrs ref', () => {
    const ref = () => {/**/};
    const vnode = h('div', { ref: ref });
    expect(vnode.vattrs.ref).toBe(ref);
  });

  it('should not set vref', () => {
    const vnode = h('div', {});
    expect(vnode.vattrs.ref).toBeUndefined();
  });

  it('should add one class from string', () => {
    const vnode = h('div', { class: 'some-class and another-class' });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class).toEqual('some-class and another-class');
  });

  it('should add class from map of classnames and booleans', () => {
    const vnode = h('div', { class: { enabled: true, checked: false } });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class).toEqual('enabled');
  });

  it('should add class from className string', () => {
    const vnode = h('div', { className: 'one point twenty-one gigawatts' });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class).toEqual('one point twenty-one gigawatts');
  });

  it('should add class from className map of classnames and booleans', () => {
    const vnode = h('div', { className: { save: true, the: true, clock: true, tower: true, hillvalley: false } });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class).toEqual('save the clock tower');
  });

  it('should add props', () => {
    const vnode = h('div', { id: 'my-id', checked: false, count: 0 });
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.id).toBe('my-id');
    expect(vnode.vattrs.checked).toBe(false);
    expect(vnode.vattrs.count).toBe(0);
  });

  it('should add attrs', () => {
    const vnode = h('div', { id: 'my-id', checked: false, count: 0 });
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.id).toBe('my-id');
    expect(vnode.vattrs.checked).toBe(false);
    expect(vnode.vattrs.count).toBe(0);
  });

  it('should add on', () => {
    function onClick() {/**/}
    const vnode = h('div', { onclick: onClick });
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.onclick).toBe(onClick);
  });

  it('should add style', () => {
    const vnode = h('div', { style: { marginLeft: '10px' } });
    expect(vnode.vattrs.style).toBeDefined();
    expect(vnode.vattrs.style.marginLeft).toBe('10px');
  });

  it('should add key string', () => {
    const vnode = h('div', { key: 'my-key' });
    expect(vnode.vkey).toBe('my-key');
  });

  it('should add key number', () => {
    const vnode = h('div', { key: 88 });
    expect(vnode.vkey).toBe(88);
  });

  it('can create vnode with proper tag', () => {
    expect(h('div', null).vtag).toEqual('div');
    expect(h('a', null).vtag).toEqual('a');
  });

  it('can create vnode with children', () => {
    const vnode = h('div', null, h('span', null), h('b', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtag).toEqual('span');
    expect(vnode.vchildren[1].vtag).toEqual('b');
  });

  it('can create vnode with one child vnode', () => {
    const vnode = h('div', null,  h('span', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtag).toEqual('span');
  });

  it('can create vnode with no props and one child vnode', () => {
    const vnode = h('div', null, h('span', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtag).toEqual('span');
  });

  it('can create vnode text with dynamic string', () => {
    const val = 'jazzhands';
    const vnode = h('div', null, val);
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toEqual('jazzhands');
  });

  it('can create vnode with text content in string', () => {
    const vnode = h('a', null, 'I am a string');
    expect(vnode.vchildren[0].vtext).toEqual('I am a string');
  });

  describe('isSameVnode', () => {

    it('should not be same vnode with slot and no vnode2 name', () => {
      const vnode1 = h('slot', { name: 'start' }, '1');
      const vnode2 = h('slot', {}, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(false);
    });

    it('should not be same vnode with slot and no vnode1 name', () => {
      const vnode1 = h('slot', {}, '1');
      const vnode2 = h('slot', { name: 'end' }, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(false);
    });

    it('should not be same vnode with slot and different vname', () => {
      const vnode1 = h('slot', { name: 'start' }, '1');
      const vnode2 = h('slot', { name: 'end' }, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(false);
    });

    it('should be same vnode with slot and same vname', () => {
      const vnode1 = h('slot', { name: 'start' }, '1');
      const vnode2 = h('slot', { name: 'start' }, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(true);
    });

    it('should be same vnode with slot and no vname', () => {
      const vnode1 = h('slot', {}, '1');
      const vnode2 = h('slot', {}, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(true);
    });

    it('should not be same vnode with same tag and different key', () => {
      const vnode1 = h('a', { attr: '1', key: 'mykey1' }, '1');
      const vnode2 = h('a', { attr: '2', key: 'mykey2' }, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(false);
    });

    it('should not be same vnode with different tag and same key', () => {
      const vnode1 = h('a', { attr: '1', key: 'mykey' }, '1');
      const vnode2 = h('b', { attr: '2', key: 'mykey' }, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(false);
    });

    it('should not be same vnode with different tag and no key', () => {
      const vnode1 = h('a', null, '1');
      const vnode2 = h('b', null, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(false);
    });

    it('should be same vnode with same tag and same key', () => {
      const vnode1 = h('a', { attr: '1', key: 'mykey' }, '1');
      const vnode2 = h('a', { attr: '2', key: 'mykey' }, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(true);
    });

    it('should be same vnode with same tag and defined data, but no key', () => {
      const vnode1 = h('a', { attr: '1' }, '1');
      const vnode2 = h('a', { attr: '2' }, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(true);
    });

    it('should be same vnode with same tag and undefined data', () => {
      const vnode1 = h('a', null, '1');
      const vnode2 = h('a', null, '2');
      expect(isSameVnode(vnode1, vnode2)).toBe(true);
    });

  });

  describe('functional components', () => {

    it('should receive props, array, and utils as props', async () => {
      let args: any;
      const MyFunction: d.FunctionalComponent = (...argArray) => {
        args = argArray;
        return null;
      };
      h(MyFunction, { 'id': 'blank' }, h('span', {}));
      expect(args.length).toBe(3);
      expect(args[0]).toEqual({ id: 'blank' });
      expect(args[1].length).toEqual(1);
      expect(args[2]).toHaveProperties(['map', 'foreach']);
    });

    it('should receive an empty object when component receives no props', async () => {
      let args: any;
      const MyFunction: d.FunctionalComponent = (...argArray) => {
        args = argArray;
        return null;
      };
      h(MyFunction, {});
      expect(args[0]).toEqual({});
      expect(args[1]).toEqual([]);
    });

    it('should receive an empty array when component receives no children', async () => {
      let args: any;
      const MyFunction: d.FunctionalComponent = (...argArray) => {
        args = argArray;
        return null;
      };
      h(MyFunction, {});
      expect(args[1]).toEqual([]);
    });


    it('should handle functional cmp which returns null', async () => {
      const MyFunction: d.FunctionalComponent = () => { return null; };
      const vnode = h(MyFunction, {});

      expect(vnode).toEqual(null);
    });

    it('should render functional cmp content', async () => {
      const MyFunction: d.FunctionalComponent = () => {
        return h('div', { id: 'fn-cmp' }, 'fn-cmp');
      };
      const vnode = h(MyFunction, {});
      expect(vnode).toEqual({
        'elm': undefined,
        'ishost': false,
        'vattrs': {'id': 'fn-cmp'},
        'vchildren': [{'vtext': 'fn-cmp'}],
        'vkey': undefined,
        'vname': undefined,
        'vtag': 'div',
        'vtext': undefined
      });
    });
  });

  describe('VDom Util methods', () => {
    it('utils.forEach should loop over items and get the ChildNode data', () => {
      const output = [];
      const FunctionalCmp: FunctionalComponent = (nodeData, children, util) => {
        util.forEach(children, element => {
          output.push(element);
          util.forEach(element.vchildren, el => {
            output.push(el);
          });
        });
        return h('article', null);
      };
      const vnode = h(FunctionalCmp, null, h('div', { id: 'blue' }, h('span', null)));
      expect(output).toEqual([
        {
          vattrs: {
            id: 'blue',
          },
          vchildren: [
            {
              elm: undefined,
              ishost: false,
              vattrs: null,
              vchildren: null,
              vkey: undefined,
              vname: undefined,
              vtag: 'span',
              vtext: undefined,
            },
          ],
          vkey: undefined,
          vname: undefined,
          vtag: 'div',
          vtext: undefined,
        },
        {
          vattrs: null,
          vchildren: null,
          vkey: undefined,
          vname: undefined,
          vtag: 'span',
          vtext: undefined,
        },
      ]);
    });

    it('replaceAttributes should return the attributes for the node', () => {
      const FunctionalCmp: FunctionalComponent = (nodeData, children, util) => {
        return util.map(children, child => {
          return {
            ...child,
            vattrs: {
              ...(child.vattrs as any),
              class: 'my-class'
            }
          };
        });
      };
      const vnode = h(FunctionalCmp, null, h('div', { id: 'blue' }, 'innerText'), h('span', null));
      expect(vnode).toEqual([
        {
          vattrs: {
            class: 'my-class',
            id: 'blue'
          },
          vchildren: [
            {
              vtext: 'innerText'
            }
          ],
          vkey: undefined,
          vname: undefined,
          vtag: 'div',
          vtext: undefined
        },
        {
          vattrs: {
            class: 'my-class'
          },
          vchildren: null,
          vkey: undefined,
          vname: undefined,
          vtag: 'span',
          vtext: undefined
        }
      ]);
    });
  });
});


function isSameVnode(vnode1: d.VNode, vnode2: d.VNode) {
  // compare if two vnode to see if they're "technically" the same
  // need to have the same element tag, and same key to be the same
  if (vnode1.vtag === vnode2.vtag && vnode1.vkey === vnode2.vkey) {
    if (vnode1.vtag === 'slot') {
      return vnode1.vname === vnode2.vname;
    }
    return true;
  }
  return false;
}
