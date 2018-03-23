import { h } from '../h';


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

  it('should not set vkey', () => {
    const vnode = h('div', null);
    expect(vnode.vkey).toBe(null);
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

});
