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
    var vnode1 = h('div', {a: {href: '/foo', minlength: 1, value: true}});
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttribute('href')).toEqual('/foo');
    expect(elm.getAttribute('minlength')).toEqual('1');
    expect(elm.getAttribute('value')).toEqual('true');
  });

  it('can be memoized', function() {
    var cachedAttrs = {href: '/foo', minlength: 1, value: true};
    var vnode1 = h('div', {a: cachedAttrs});
    var vnode2 = h('div', {a: cachedAttrs});
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
    var vnode1 = h('div', {a: {href: null, minlength: 0, value: false}});
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttribute('href')).toEqual('null');
    expect(elm.getAttribute('minlength')).toEqual('0');
    expect(elm.getAttribute('value')).toEqual('false');
  });

  it('are set correctly when namespaced', function() {
    var vnode1 = h('div', {a: {'xlink:href': '#foo'}});
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toEqual('#foo');
  });

  it('should not touch class nor id fields', function() {
    elm = mockElement('div');
    elm.id = 'myId';
    elm.className = 'myClass';
    vnode0.elm = elm;
    var vnode1 = h('div', {a: {}}, 'Hello');
    elm = patch(vnode0, vnode1).elm;
    expect(elm.tagName).toEqual('DIV');
    expect(elm.id).toEqual('myId');
    expect(elm.className).toEqual('myClass');
    expect(elm.textContent).toEqual('Hello');
  });

  describe('boolean attribute', function() {

    it('is present and empty string if the value is truthy', function() {
      var vnode1 = h('div', {a: {required: true, readonly: 1, noresize: 'truthy'}});
      elm = patch(vnode0, vnode1).elm;
      expect(elm.hasAttribute('required')).toEqual(true);
      expect(elm.getAttribute('required')).toEqual('');
      expect(elm.hasAttribute('readonly')).toEqual(true);
      expect(elm.getAttribute('readonly')).toEqual('');
      expect(elm.hasAttribute('noresize')).toEqual(true);
      expect(elm.getAttribute('noresize')).toEqual('');
    });

    it('is omitted if the value is falsy', function() {
      var vnode1 = h('div', {a: {required: false, readonly: 0, noresize: null}});
      elm = patch(vnode0, vnode1).elm;
      expect(elm.getAttribute('required')).toEqual(null);
      expect(elm.getAttribute('readonly')).toEqual(null);
      expect(elm.getAttribute('noresize')).toEqual(null);
    });

  });

  describe('Object.prototype property', function() {
    it('is not considered as a boolean attribute and shouldn\'t be omitted', function() {
      var vnode1 = h('div', {a: {constructor: true}});
      elm = patch(vnode0, vnode1).elm;
      expect(elm.getAttribute('constructor')).toEqual('true');
      var vnode2 = h('div', {a: {constructor: false}});
      elm = patch(vnode0, vnode2).elm;
      expect(elm.getAttribute('constructor')).toEqual('false');
    });
  });

  describe('svg', function () {

    it('adds correctly xlink namespaced attribute', function(){
      var xlinkNS = 'http://www.w3.org/1999/xlink';
      var testUrl = '/test';
      var a = h('svg', {}, [
        h('div', {
          a: { 'xlink:href': testUrl }
        }, [])
      ]);

      vnode0.elm = mockElement('svg');
      var result: any = patch(vnode0, a).elm;
      expect(result.childNodes.length).toEqual(1);
      expect(result.childNodes[0].getAttribute('xlink:href')).toEqual(testUrl);
      expect(result.childNodes[0].getAttributeNS(xlinkNS, 'href')).toEqual(testUrl);
    });

    it('adds correctly xml namespaced attribute', function(){
      var xmlNS = 'http://www.w3.org/XML/1998/namespace';
      var testAttrValue = 'und';
      var a = h('svg', { a: { 'xml:lang': testAttrValue } }, []);

      vnode0.elm = mockElement('svg');
      var result: any = patch(vnode0, a).elm;
      expect(result.getAttributeNS(xmlNS, 'lang')).toEqual(testAttrValue);
      expect(result.getAttribute('xml:lang')).toEqual(testAttrValue);
    });
  });

});
