import * as d from '../../../declarations';
import { h } from '../h';
import { mockElement, mockRenderer } from '../../../testing/mocks';


describe('attributes', function() {
  const patch = mockRenderer();
  let hostElm: any;
  let vnode0: d.VNode;

  beforeEach(function() {
    hostElm = mockElement('div');
    vnode0 = {};
    vnode0.elm = hostElm;
  });

  it('have their provided values', function() {
    const vnode1 = h('div', { href: '/foo', minlength: 1, value: true });
    hostElm = patch(hostElm, vnode0, vnode1).elm;
    expect(hostElm.getAttribute('href')).toEqual('/foo');
    expect(hostElm.getAttribute('minlength')).toEqual('1');
    expect(hostElm.getAttribute('value')).toEqual('true');
  });

  it('can be memoized', async function() {
    const cachedAttrs = { href: '/foo', minlength: 1, value: true };
    const vnode1 = h('div', cachedAttrs);
    const vnode2 = h('div', cachedAttrs);
    hostElm = patch(hostElm, vnode0, vnode1).elm;
    expect(hostElm.getAttribute('href')).toEqual('/foo');
    expect(hostElm.getAttribute('minlength')).toEqual('1');
    expect(hostElm.getAttribute('value')).toEqual('true');
    hostElm = patch(hostElm, vnode1, vnode2).elm;
    expect(hostElm.getAttribute('href')).toEqual('/foo');
    expect(hostElm.getAttribute('minlength')).toEqual('1');
    expect(hostElm.getAttribute('value')).toEqual('true');
  });

  it('are not omitted when falsy values are provided', function() {
    const vnode1 = h('div', {href: null, minlength: 0, value: false });
    hostElm = patch(hostElm, vnode0, vnode1).elm;
    expect(hostElm.getAttribute('href')).toEqual(null);
    expect(hostElm.getAttribute('minlength')).toEqual('0');
    expect(hostElm.getAttribute('value')).toEqual('false');
  });

  it('are set correctly when namespaced', function() {
    const vnode1 = h('div', { 'xlink:href': '#foo' });
    hostElm = patch(hostElm, vnode0, vnode1).elm;
    expect(hostElm.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toEqual('#foo');
  });

  it('should not touch class nor id fields', function() {
    hostElm = mockElement('div');
    hostElm.id = 'myId';
    hostElm.className = 'myClass';
    vnode0.elm = hostElm;
    const vnode1 = h('div', null, 'Hello');
    hostElm = patch(hostElm, vnode0, vnode1).elm;
    expect(hostElm.tagName).toEqual('DIV');
    expect(hostElm.id).toEqual('myId');
    expect(hostElm.className).toEqual('myClass');
    expect(hostElm.textContent).toEqual('Hello');
  });

  describe('boolean attribute', function() {

    it('is present if the value is truthy', function() {
      const vnode1 = h('div', { required: true, readonly: 1, noresize: 'truthy' });
      hostElm = patch(hostElm, vnode0, vnode1).elm;
      expect(hostElm.hasAttribute('required')).toEqual(true);
      expect(hostElm.getAttribute('required')).toEqual('');
      expect(hostElm.hasAttribute('readonly')).toEqual(true);
      expect(hostElm.getAttribute('readonly')).toEqual('');
      expect(hostElm.hasAttribute('noresize')).toEqual(true);
      expect(hostElm.getAttribute('noresize')).toEqual('');
    });

    it('is omitted if the value is falsy', function() {
      const vnode1 = h('div', { required: false, readonly: 'false', noresize: null });
      hostElm = patch(hostElm, vnode0, vnode1).elm;
      expect(hostElm.getAttribute('required')).toEqual(null);
      expect(hostElm.getAttribute('readonly')).toEqual(null);
      expect(hostElm.getAttribute('noresize')).toEqual(null);
    });
  });

  describe('svg', function () {

    it('adds correctly xlink namespaced attribute', function() {
      const xlinkNS = 'http://www.w3.org/1999/xlink';
      const testUrl = '/test';
      const a = h('svg', {},
        h('div', {
          'xlink:href': testUrl
        })
      );

      vnode0.elm = mockElement('svg') as any;
      const result: any = patch(hostElm, vnode0, a).elm;
      expect(result.childNodes.length).toEqual(1);
      expect(result.childNodes[0].getAttribute('href')).toEqual(testUrl);
      expect(result.childNodes[0].getAttributeNS(xlinkNS, 'href')).toEqual(testUrl);
    });
  });

});
