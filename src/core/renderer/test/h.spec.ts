import { h } from '../h';

describe('h()', () => {

  it('should get vnode with only tag string', () => {
    var vnode = h('div', null);
    expect(vnode.vtag).toEqual('div');
  });

  it('should get vnode with tag and data', () => {
    var vnode = h('div', { id: 'my-id' });
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.id).toBe('my-id');
  });

  it('should get vnode with tag and child text', () => {
    var vnode = h('div', null, 'child text');
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toBe('child text');
  });

  it('should get vnode with tag and multiple child text', () => {
    var vnode = h('div', null, 'child 1', 'child 2');
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toBe('child 1child 2');
  });

  it('should get vnode with tag and child number', () => {
    var vnode = h('div', null, 0);
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toBe('0');
  });

  it('should get vnode with tag with multiple child h()', () => {
    var vnode = h('div', null, h('child-a', null), h('child-b', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(2);
    expect(vnode.vchildren[0].vtag).toBe('child-a');
    expect(vnode.vchildren[1].vtag).toBe('child-b');
  });

  it('should get vnode with tag with one child h()', () => {
    var vnode = h('parent', null, h('child', null));
    expect(vnode.vtag).toEqual('parent');
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(1);
    expect(vnode.vchildren[0].vtag).toBe('child');
  });

  it('should get vnode with tag with two child h()', () => {
    var vnode = h('parent', null, h('child-a', null), h('child-b', null));
    expect(vnode.vtag).toEqual('parent');
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(2);
    expect(vnode.vchildren[0].vtag).toBe('child-a');
    expect(vnode.vchildren[1].vtag).toBe('child-b');
  });

  it('should get vnode with tag, data, child text', () => {
    var vnode = h('div', { id: 'my-id' }, 'child text');
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vchildren[0].vtext).toBe('child text');
  });

  it('should get vnode with tag, data, child number', () => {
    var vnode = h('div', { id: 'my-id' }, 0);
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vchildren[0].vtext).toBe('0');
  });

  it('should get vnode with tag, data, one child h()', () => {
    var vnode = h('div', { id: 'my-id' }, h('child-a', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vchildren).toBeDefined();
    expect(vnode.vchildren.length).toBe(1);
    expect(vnode.vchildren[0].vtag).toBe('child-a');
  });

  it('should get vnode with tag, data, array of children h()', () => {
    var vnode = h('div', { id: 'my-id' },
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

  it('should add multiple classes from string, w/ extra whitespace', () => {
    var vnode = h('div', { class: '  dragons   love  tacos  ' });
    expect(vnode.vattrs.class).toBeDefined();
    expect(Object.keys(vnode.vattrs.class).length).toBe(3);
    expect(vnode.vattrs.class['dragons']).toBe(true);
    expect(vnode.vattrs.class['love']).toBe(true);
    expect(vnode.vattrs.class['tacos']).toBe(true);
  });

  it('should add one class from string', () => {
    var vnode = h('div', { class: 'some-class' });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class['some-class']).toBe(true);
  });

  it('should add class from map of classnames and booleans', () => {
    var vnode = h('div', { class: { enabled: true, checked: false } });
    expect(vnode.vattrs.class).toBeDefined();
    expect(vnode.vattrs.class.enabled).toBe(true);
    expect(vnode.vattrs.class.checked).toBe(false);
  });

  it('should add props', () => {
    var vnode = h('div', { id: 'my-id', checked: false, count: 0 });
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.id).toBe('my-id');
    expect(vnode.vattrs.checked).toBe(false);
    expect(vnode.vattrs.count).toBe(0);
  });

  it('should add attrs', () => {
    var vnode = h('div', { id: 'my-id', checked: false, count: 0 });
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.id).toBe('my-id');
    expect(vnode.vattrs.checked).toBe(false);
    expect(vnode.vattrs.count).toBe(0);
  });

  it('should add on', () => {
    function onClick() {}
    var vnode = h('div', { onclick: onClick });
    expect(vnode.vattrs).toBeDefined();
    expect(vnode.vattrs.onclick).toBe(onClick);
  });

  it('should add style', () => {
    var vnode = h('div', { style: { marginLeft: '10px' } });
    expect(vnode.vattrs.style).toBeDefined();
    expect(vnode.vattrs.style.marginLeft).toBe('10px');
  });

  it('should add key string', () => {
    var vnode = h('div', { key: 'my-key' });
    expect(vnode.vkey).toBe('my-key');
  });

  it('should add key number', () => {
    var vnode = h('div', { key: 88 });
    expect(vnode.vkey).toBe(88);
  });

  it('can create vnode with proper tag', () => {
    expect(h('div', null).vtag).toEqual('div');
    expect(h('a', null).vtag).toEqual('a');
  });

  it('can create vnode with children', () => {
    var vnode = h('div', null, h('span', null), h('b', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtag).toEqual('span');
    expect(vnode.vchildren[1].vtag).toEqual('b');
  });

  it('can create vnode with one child vnode', () => {
    var vnode = h('div', null,  h('span', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtag).toEqual('span');
  });

  it('can create vnode with no props and one child vnode', () => {
    var vnode = h('div', null, h('span', null));
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtag).toEqual('span');
  });

  it('can create vnode text with dynamic string', () => {
    var val = 'jazzhands';
    var vnode = h('div', null, val);
    expect(vnode.vtag).toEqual('div');
    expect(vnode.vchildren[0].vtext).toEqual('jazzhands');
  });

  it('can create vnode with text content in string', () => {
    var vnode = h('a', null, 'I am a string');
    expect(vnode.vchildren[0].vtext).toEqual('I am a string');
  });
});
