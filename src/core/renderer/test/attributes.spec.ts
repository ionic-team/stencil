import { h } from '../h';
import { mockRenderer, mockElement } from '../../../testing/mocks';
import { VNode } from '../vnode';


describe('attributes', function() {
  const patch = mockRenderer();
  var elm: any;
  var vnode0: any;

  beforeEach(function() {
    elm = mockElement('div');
    vnode0 = new VNode();
    vnode0.elm = elm;
  });

  it('have their provided values', function() {
    var vnode1 = h('div', { href: '/foo', minlength: 1, value: true });
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttribute('href')).toEqual('/foo');
    expect(elm.getAttribute('minlength')).toEqual('1');
    expect(elm.getAttribute('value')).toEqual('true');
  });

  it('can be memoized', async function() {
    var cachedAttrs = { href: '/foo', minlength: 1, value: true };
    var vnode1 = h('div', cachedAttrs);
    var vnode2 = h('div', cachedAttrs);
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttribute('href')).toEqual('/foo');
    expect(elm.getAttribute('minlength')).toEqual('1');
    expect(elm.getAttribute('value')).toEqual('true');
    elm = patch(vnode1, vnode2).elm;
    expect(elm.getAttribute('href')).toEqual('/foo');
    expect(elm.getAttribute('minlength')).toEqual('1');
    expect(elm.getAttribute('value')).toEqual('true');
  });

  it('are not omitted when falsy values are provided', function() {
    var vnode1 = h('div', {href: null, minlength: 0, value: false });
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttribute('href')).toEqual('null');
    expect(elm.getAttribute('minlength')).toEqual('0');
    expect(elm.getAttribute('value')).toEqual('false');
  });

  it('are set correctly when namespaced', function() {
    var vnode1 = h('div', { 'xlink:href': '#foo' });
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toEqual('#foo');
  });

  it('should not touch class nor id fields', function() {
    elm = mockElement('div');
    elm.id = 'myId';
    elm.className = 'myClass';
    vnode0.elm = elm;
    var vnode1 = h('div', null, 'Hello');
    elm = patch(vnode0, vnode1).elm;
    expect(elm.tagName).toEqual('DIV');
    expect(elm.id).toEqual('myId');
    expect(elm.className).toEqual('myClass');
    expect(elm.textContent).toEqual('Hello');
  });

  describe('boolean attribute', function() {

    it('is present if the value is truthy', function() {
      var vnode1 = h('div', { required: true, readonly: 1, noresize: 'truthy' });
      elm = patch(vnode0, vnode1).elm;
      expect(elm.hasAttribute('required')).toEqual(true);
      expect(elm.getAttribute('required')).toEqual('true');
      expect(elm.hasAttribute('readonly')).toEqual(true);
      expect(elm.getAttribute('readonly')).toEqual('1');
      expect(elm.hasAttribute('noresize')).toEqual(true);
      expect(elm.getAttribute('noresize')).toEqual('truthy');
    });

    it('is omitted if the value is falsy', function() {
      var vnode1 = h('div', { required: false, readonly: 'false', noresize: null });
      elm = patch(vnode0, vnode1).elm;
      expect(elm.getAttribute('required')).toEqual(null);
      expect(elm.getAttribute('readonly')).toEqual(null);
      expect(elm.getAttribute('noresize')).toEqual(null);
    });
  });

  describe('svg', function () {

    it('adds correctly xlink namespaced attribute', function() {
      var xlinkNS = 'http://www.w3.org/1999/xlink';
      var testUrl = '/test';
      var a = h('svg', {},
        h('div', {
          'xlink:href': testUrl
        })
      );

      vnode0.elm = mockElement('svg');
      var result: any = patch(vnode0, a).elm;
      expect(result.childNodes.length).toEqual(1);
      expect(result.childNodes[0].getAttribute('href')).toEqual(testUrl);
      expect(result.childNodes[0].getAttributeNS(xlinkNS, 'href')).toEqual(testUrl);
    });
  });

});
