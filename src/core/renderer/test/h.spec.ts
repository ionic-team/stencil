import { h } from '../h';
import { mockElement } from '../../../test';
import { SVG_NS } from '../../../util/constants';

describe('h', function() {
  const elm = mockElement('elm-div');

  it('should get vnode with only tag string', function() {
    // h(sel: string)
    var vnode = h('div');
    expect(vnode.e).toEqual('div');
  });

  it('should get vnode with only element as first arg', function() {
    // h(sel: Node)
    var vnode = h(elm);
    expect(vnode.e).toEqual('elm-div');
    expect(vnode.n.nodeName).toEqual('ELM-DIV');
  });

  it('should get vnode with tag and data', function() {
    // h(sel: string, data: VNodeData)
    var vnode = h('div', { attrs: { id: 'my-id' } });
    expect(vnode.e).toEqual('div');
    expect(vnode.a).toBeDefined();
    expect(vnode.a.id).toBe('my-id');
  });

  it('should get vnode with node and data', function() {
    // h(sel: Node, data: VNodeData)
    var vnode = h(elm, { attrs: { id: 'my-id' } });
    expect(vnode.e).toEqual('elm-div');
    expect(vnode.a).toBeDefined();
    expect(vnode.a.id).toBe('my-id');
  });

  it('should get vnode with tag and child text', function() {
    // h(sel: string, text: string)
    var vnode = h('div', 'child text');
    expect(vnode.e).toEqual('div');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);
    expect(vnode.h[0].t).toBe('child text');
  });

  it('should get vnode with tag and child number', function() {
    // h(sel: string, num: number)
    var vnode = h('div', 0);
    expect(vnode.e).toEqual('div');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);
    expect(vnode.h[0].t).toBe('0');
  });

  it('should get vnode with tag with multiple child h()', function() {
    // h(sel: string, children: Array<VNode>)
    var vnode = h('div', [
      h('child-a'),
      h('child-b')
    ]);
    expect(vnode.e).toEqual('div');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(2);
    expect(vnode.h[0].e).toBe('child-a');
    expect(vnode.h[1].e).toBe('child-b');
  });

  it('should get vnode with tag with one child h()', function() {
    // h(sel: string, child: VNode)
    var vnode = h('div', h('child-a'));
    expect(vnode.e).toEqual('div');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);
    expect(vnode.h[0].e).toBe('child-a');
  });

  it('should get vnode with tag, data, child text', function() {
    // h(sel: string, data: VNodeData, text: string)
    var vnode = h('div', { attrs: { id: 'my-id' } }, 'child text');
    expect(vnode.e).toEqual('div');
    expect(vnode.a).toBeDefined();
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);

    expect(vnode.h[0].t).toBe('child text');
  });

  it('should get vnode with tag, data, child number', function() {
    // h(sel: string, data: VNodeData, text: number)
    var vnode = h('div', { attrs: { id: 'my-id' } }, 0);
    expect(vnode.e).toEqual('div');
    expect(vnode.a).toBeDefined();
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);

    expect(vnode.h[0].t).toBe('0');
  });

  it('should get vnode with tag, data, one child h()', function() {
    // h(sel: string, data: VNodeData, children: VNode)
    var vnode = h('div', { attrs: { id: 'my-id' } }, h('child-a'));
    expect(vnode.e).toEqual('div');
    expect(vnode.a).toBeDefined();
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(1);
    expect(vnode.h[0].e).toBe('child-a');
  });

  it('should get vnode with tag, data, array of children h()', function() {
    // h(sel: string, data: VNodeData, children: VNode)
    var vnode = h('div', { attrs: { id: 'my-id' } }, [
      h('child-a'),
      h('child-b')
    ]);
    expect(vnode.e).toEqual('div');
    expect(vnode.a).toBeDefined();
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(2);
    expect(vnode.h[0].e).toBe('child-a');
    expect(vnode.h[1].e).toBe('child-b');
  });

  it('should add class', function() {
    var vnode = h('div', { class: { enabled: true, checked: false } });
    expect(vnode.c).toBeDefined();
    expect(vnode.c.enabled).toBe(true);
    expect(vnode.c.checked).toBe(false);
  });

  it('should add props', function() {
    var vnode = h('div', { props: { id: 'my-id', checked: false, count: 0 } });
    expect(vnode.p).toBeDefined();
    expect(vnode.p.id).toBe('my-id');
    expect(vnode.p.checked).toBe(false);
    expect(vnode.p.count).toBe(0);
  });

  it('should add attrs', function() {
    var vnode = h('div', { attrs: { id: 'my-id', checked: false, count: 0 } });
    expect(vnode.a).toBeDefined();
    expect(vnode.a.id).toBe('my-id');
    expect(vnode.a.checked).toBe(false);
    expect(vnode.a.count).toBe(0);
  });

  it('should add on', function() {
    function onClick() {}
    var vnode = h('div', { on: { click: onClick } });
    expect(vnode.o).toBeDefined();
    expect(vnode.o.click).toBe(onClick);
  });

  it('should add style', function() {
    var vnode = h('div', { style: { marginLeft: '10px' } });
    expect(vnode.s).toBeDefined();
    expect(vnode.s.marginLeft).toBe('10px');
  });

  it('should add key string', function() {
    var vnode = h('div', { key: 'my-key' });
    expect(vnode.k).toBe('my-key');
  });

  it('should add key number', function() {
    var vnode = h('div', { key: 88 });
    expect(vnode.k).toBe(88);
  });

  it('should manually add namespace', function() {
    var vnode = h('idk', { ns: 'whatever' });
    expect(vnode.m).toBe('whatever');
  });

  it('should add svg namespace to top h()', function() {
    var vnode = h('svg');
    expect(vnode.m).toBe(SVG_NS);
  });

  it('should not add svg namespace with custom tag starting with svg', function() {
    var vnode = h('svg-is-awesome');
    expect(vnode.m).toBeUndefined();
  });

  it('should add svg namespace to child elements', function() {
    var vnode = h('svg', [
      h('circle', [
        h('line')
      ]),
      h('foreignObject', [
        h('div')
      ])
    ]);
    expect(vnode.m).toBe(SVG_NS);
    expect(vnode.h[0].m).toBe(SVG_NS);
    expect(vnode.h[0].h[0].m).toBe(SVG_NS);
    expect(vnode.h[1].m).toBe(SVG_NS);
    expect(vnode.h[1].h[0].m).toBeUndefined();
  });

  it('should parse sel id attr', function() {
    var vnode = h('div#id');
    expect(vnode.e).toBe('div');
    expect(vnode.a.id).toBe('id');
  });

  it('should parse sel class name', function() {
    var vnode = h('div.my-class');
    expect(vnode.e).toBe('div');
    expect(vnode.c['my-class']).toBe(true);
  });

  it('should parse sel id and class name', function() {
    var vnode = h('div#id.my-class');
    expect(vnode.e).toBe('div');
    expect(vnode.c['my-class']).toBe(true);
    expect(vnode.a.id).toBe('id');
  });

  it('can create vnode with proper tag', function() {
    expect(h('div').e).toEqual('div');
    expect(h('a').e).toEqual('a');
  });

  it('can create vnode with children', function() {
    var vnode = h('div', [h('span#hello'), h('b.world')]);
    expect(vnode.e).toEqual('div');
    expect(vnode.h[0].e).toEqual('span');
    expect(vnode.h[0].a.id).toEqual('hello');
    expect(vnode.h[1].e).toEqual('b');
    expect(vnode.h[1].c.world).toEqual(true);
  });

  it('can create vnode with one child vnode', function() {
    var vnode = h('div', h('span#hello'));
    expect(vnode.e).toEqual('div');
    expect(vnode.h[0].e).toEqual('span');
    expect(vnode.h[0].a.id).toEqual('hello');
  });

  it('can create vnode with props and one child vnode', function() {
    var vnode = h('div', {}, h('span#hello'));
    expect(vnode.e).toEqual('div');
    expect(vnode.h[0].e).toEqual('span');
    expect(vnode.h[0].a.id).toEqual('hello');
  });

  it('can create vnode with text content in string', function() {
    var vnode = h('a', 'I am a string');
    expect(vnode.h[0].t).toEqual('I am a string');
  });

  it('can create vnode with text content in string array', function() {
    var vnode = h('a', ['I am a string']);
    expect(vnode.h[0].t).toEqual('I am a string');
  });

  it('can create vnode with props and text content in string', function() {
    var vnode = h('a', {}, 'I am a string');
    expect(vnode.h[0].t).toEqual('I am a string');
  });
});
