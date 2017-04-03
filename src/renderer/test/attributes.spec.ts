
import { initRenderer, h } from '../core';
import { PlatformClient } from '../../platform/platform-client';

const document: HTMLDocument = (<any>global).document;

var patch = initRenderer(PlatformClient(window, document, {}));

describe('attributes', function() {
  var elm, vnode0;

  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });

  it('have their provided values', function() {
    var vnode1 = h('div', {attrs: {href: '/foo', minlength: 1, value: true}});
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttribute('href')).toEqual('/foo');
    expect(elm.getAttribute('minlength')).toEqual('1');
    expect(elm.getAttribute('value')).toEqual('true');
  });
  it('can be memoized', function() {
    var cachedAttrs = {href: '/foo', minlength: 1, value: true};
    var vnode1 = h('div', {attrs: cachedAttrs});
    var vnode2 = h('div', {attrs: cachedAttrs});
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
    var vnode1 = h('div', {attrs: {href: null, minlength: 0, value: false}});
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttribute('href')).toEqual('null');
    expect(elm.getAttribute('minlength')).toEqual('0');
    expect(elm.getAttribute('value')).toEqual('false');
  });
  it('are set correctly when namespaced', function() {
    var vnode1 = h('div', {attrs: {'xlink:href': '#foo'}});
    elm = patch(vnode0, vnode1).elm;
    expect(elm.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toEqual('#foo');
  });
  it('should not touch class nor id fields', function() {
    elm = document.createElement('div');
    elm.id = 'myId';
    elm.className = 'myClass';
    vnode0 = elm;
    var vnode1 = h('div#myId.myClass', {attrs: {}}, ['Hello']);
    elm = patch(vnode0, vnode1).elm;
    expect(elm.tagName).toEqual('DIV');
    expect(elm.id).toEqual('myId');
    expect(elm.className).toEqual('myClass');
    expect(elm.textContent).toEqual('Hello');
  });
  describe('boolean attribute', function() {
    it('is present and empty string if the value is truthy', function() {
      var vnode1 = h('div', {attrs: {required: true, readonly: 1, noresize: 'truthy'}});
      elm = patch(vnode0, vnode1).elm;
      expect(elm.hasAttribute('required')).toEqual(true);
      expect(elm.getAttribute('required')).toEqual('');
      expect(elm.hasAttribute('readonly')).toEqual(true);
      expect(elm.getAttribute('readonly')).toEqual('');
      expect(elm.hasAttribute('noresize')).toEqual(true);
      expect(elm.getAttribute('noresize')).toEqual('');
    });
    it('is omitted if the value is falsy', function() {
      var vnode1 = h('div', {attrs: {required: false, readonly: 0, noresize: null}});
      elm = patch(vnode0, vnode1).elm;
      expect(elm.getAttribute('required')).toEqual(null);
      expect(elm.getAttribute('readonly')).toEqual(null);
      expect(elm.getAttribute('noresize')).toEqual(null);
    });
  });
  describe('Object.prototype property', function() {
    it('is not considered as a boolean attribute and shouldn\'t be omitted', function() {
      var vnode1 = h('div', {attrs: {constructor: true}});
      elm = patch(vnode0, vnode1).elm;
      expect(elm.getAttribute('constructor')).toEqual('true');
      var vnode2 = h('div', {attrs: {constructor: false}});
      elm = patch(vnode0, vnode2).elm;
      expect(elm.getAttribute('constructor')).toEqual('false');
    })
  });
});
