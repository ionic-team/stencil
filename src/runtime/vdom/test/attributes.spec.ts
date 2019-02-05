import * as d from '@declarations';
import { h } from '../h';
import { renderVdom } from '../render';


describe('attributes', () => {
  let hostElm: d.HostElement;
  let hostRef: d.HostRef;
  let cmpMeta: d.ComponentRuntimeMeta;

  beforeEach(() => {
    hostElm = document.createElement('div');
    hostRef = {
      vnode: {
        elm: hostElm,
        vkey: 'div'
      }
    };
    cmpMeta = {};
  });

  it('have their provided values', () => {
    const renderFnResults = h('host', { href: '/foo', minlength: 1, value: true });
    renderVdom(hostElm, hostRef, cmpMeta, renderFnResults);

    expect(hostElm.getAttribute('href')).toEqual('/foo');
    expect(hostElm.getAttribute('minlength')).toEqual('1');
    expect(hostElm.getAttribute('value')).toEqual('');
  });

  it('can be memoized', async () => {
    const cachedAttrs = { href: '/foo', minlength: 1, value: true };
    hostRef.vnode = h('div', cachedAttrs);
    hostRef.vnode.elm = hostElm;

    const renderFnResults = h('host', cachedAttrs);

    renderVdom(hostElm, hostRef, cmpMeta, renderFnResults);

    expect(hostElm.getAttribute('href')).toEqual('/foo');
    expect(hostElm.getAttribute('minlength')).toEqual('1');
    expect(hostElm.getAttribute('value')).toEqual('');
    hostElm = patch(hostElm, vnode1, vnode2).elm;
    expect(hostElm.getAttribute('href')).toEqual('/foo');
    expect(hostElm.getAttribute('minlength')).toEqual('1');
    expect(hostElm.getAttribute('value')).toEqual('');
  });

  it('are not omitted when falsy values are provided', () => {
    const vnode1 = h('div', {href: null, minlength: 0, value: false });
    hostElm = patch(hostElm, vnode0, vnode1).elm;
    expect(hostElm.getAttribute('href')).toEqual(null);
    expect(hostElm.getAttribute('minlength')).toEqual('0');
    expect(hostElm.getAttribute('value')).toEqual(null);
  });

  it('are set correctly when namespaced', () => {
    const vnode1 = h('div', { 'xlink:href': '#foo' });
    hostElm = patch(hostElm, vnode0, vnode1).elm;
    expect(hostElm.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toEqual('#foo');
  });

  it('should not touch class nor id fields', () => {
    hostElm = document.createElement('div');
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

  describe('boolean attribute', () => {

    it('is present if the value is truthy', () => {
      const vnode1 = h('div', { required: true, readonly: 1, noresize: 'truthy' });
      hostElm = patch(hostElm, vnode0, vnode1).elm;
      expect(hostElm.hasAttribute('required')).toEqual(true);
      expect(hostElm.getAttribute('required')).toEqual('');
      expect(hostElm.hasAttribute('readonly')).toEqual(true);
      expect(hostElm.getAttribute('readonly')).toEqual('1');
      expect(hostElm.hasAttribute('noresize')).toEqual(true);
      expect(hostElm.getAttribute('noresize')).toEqual('truthy');
    });

    it('is omitted if the value is falsy', () => {
      const vnode1 = h('div', { required: false, readonly: 'false', noresize: null });
      hostElm = patch(hostElm, vnode0, vnode1).elm;
      expect(hostElm.getAttribute('required')).toEqual(null);
      expect(hostElm.getAttribute('readonly')).toEqual('false');
      expect(hostElm.getAttribute('noresize')).toEqual(null);
    });
  });

  describe('svg', function () {

    it('adds correctly xlink namespaced attribute', () => {
      const xlinkNS = 'http://www.w3.org/1999/xlink';
      const testUrl = '/test';
      const a = h('svg', {},
        h('div', {
          'xlink:href': testUrl
        })
      );

      vnode0.elm = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as any;
      const result: any = patch(hostElm, vnode0, a).elm;
      expect(result.childNodes.length).toEqual(1);
      expect(result.childNodes[0].getAttribute('href')).toEqual(testUrl);
      expect(result.childNodes[0].getAttributeNS(xlinkNS, 'href')).toEqual(testUrl);
    });
  });

});
