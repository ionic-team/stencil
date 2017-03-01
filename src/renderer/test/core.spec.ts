
import { init, h, vnode, VNode, VNodeData } from '../index';
import { classModule } from '../modules/class';
import { eventListenersModule } from '../modules/eventlisteners';
import { DomApi } from '../api/dom-api';
import { BrowserDomApi } from '../api/browser-api';
import * as shuffle from 'knuth-shuffle';

import { mockDocument } from '../../utils/test/mocks';
const document = mockDocument();

var patch = init([
  classModule,
  eventListenersModule,
], new BrowserDomApi(document));


function prop(name) {
  return function(obj) {
    return obj[name];
  };
}

function map(fn, list) {
  var ret = [];
  for (var i = 0; i < list.length; ++i) {
    ret[i] = fn(list[i]);
  }
  return ret;
}

var inner = prop('innerHTML');

describe('renderer', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  describe('hyperscript', function() {
    it('can create vnode with proper tag', function() {
      expect(h('div').sel).toEqual('div');
      expect(h('a').sel).toEqual('a');
    });
    // it('can create vnode with children', function() {
    //   var vnode = h('div', [h('span#hello'), h('b.world')]);
    //   assert.equal(vnode.sel, 'div');
    //   assert.equal((<VNode>vnode.children[0]).sel, 'span#hello');
    //   assert.equal((<VNode>vnode.children[1]).sel, 'b.world');
    // });
    // it('can create vnode with one child vnode', function() {
    //   var vnode = h('div', h('span#hello'));
    //   assert.equal(vnode.sel, 'div');
    //   assert.equal((<VNode>vnode.children[0]).sel, 'span#hello');
    // });
    // it('can create vnode with props and one child vnode', function() {
    //   var vnode = h('div', {}, h('span#hello'));
    //   assert.equal(vnode.sel, 'div');
    //   assert.equal((<VNode>vnode.children[0]).sel, 'span#hello');
    // });
    // it('can create vnode with text content', function() {
    //   var vnode = h('a', ['I am a string']);
    //   assert.equal((<VNode>vnode.children[0]).text, 'I am a string');
    // });
    // it('can create vnode with text content in string', function() {
    //   var vnode = h('a', 'I am a string');
    //   assert.equal(vnode.text, 'I am a string');
    // });
    // it('can create vnode with props and text content in string', function() {
    //   var vnode = h('a', {}, 'I am a string');
    //   assert.equal(vnode.text, 'I am a string');
    // });
    // it('can create vnode for comment', function() {
    //   var vnode = h('!', 'test');
    //   assert.equal(vnode.sel, '!');
    //   assert.equal(vnode.text, 'test');
    // });
  });
  // describe('created element', function() {
  //   it('has tag', function() {
  //     elm = patch(vnode0, h('div')).elm;
  //     assert.equal(elm.tagName, 'DIV');
  //   });
  //   it('has different tag and id', function() {
  //     var elm: any = document.createElement('div');
  //     vnode0.appendChild(elm);
  //     var vnode1 = h('span#id');
  //     elm = patch(elm, vnode1).elm;
  //     assert.equal(elm.tagName, 'SPAN');
  //     assert.equal(elm.id, 'id');
  //   });
  //   it('has id', function() {
  //     elm = patch(vnode0, h('div', [h('div#unique')])).elm;
  //     assert.equal(elm.firstChild.id, 'unique');
  //   });
  //   it('has correct namespace', function() {
  //     var SVGNamespace = 'http://www.w3.org/2000/svg';
  //     var XHTMLNamespace = 'http://www.w3.org/1999/xhtml';

  //     elm = patch(vnode0, h('div', [h('div', {ns: SVGNamespace})])).elm;
  //     assert.equal(elm.firstChild.namespaceURI, SVGNamespace);

  //     // verify that svg tag automatically gets svg namespace
  //     elm = patch(vnode0, h('svg', [
  //       h('foreignObject', [
  //         h('div', ['I am HTML embedded in SVG'])
  //       ])
  //     ])).elm;
  //     assert.equal(elm.namespaceURI, SVGNamespace);
  //     assert.equal(elm.firstChild.namespaceURI, SVGNamespace);
  //     assert.equal(elm.firstChild.firstChild.namespaceURI, XHTMLNamespace);

  //     // verify that svg tag with extra selectors gets svg namespace
  //     elm = patch(vnode0, h('svg#some-id')).elm;
  //     assert.equal(elm.namespaceURI, SVGNamespace);

  //     // verify that non-svg tag beginning with 'svg' does NOT get namespace
  //     elm = patch(vnode0, h('svg-custom-el')).elm;
  //     assert.notEqual(elm.namespaceURI, SVGNamespace);
  //   });
  //   it('is receives classes in selector', function() {
  //     elm = patch(vnode0, h('div', [h('i.am.a.class')])).elm;
  //     assert(elm.firstChild.classList.contains('am'));
  //     assert(elm.firstChild.classList.contains('a'));
  //     assert(elm.firstChild.classList.contains('class'));
  //   });
  //   it('is receives classes in class property', function() {
  //     elm = patch(vnode0, h('i', {class: {am: true, a: true, class: true, not: false}})).elm;
  //     assert(elm.classList.contains('am'));
  //     assert(elm.classList.contains('a'));
  //     assert(elm.classList.contains('class'));
  //     assert(!elm.classList.contains('not'));
  //   });
  //   it('handles classes from both selector and property', function() {
  //     elm = patch(vnode0, h('div', [h('i.has', {class: {classes: true}})])).elm;
  //     assert(elm.firstChild.classList.contains('has'));
  //     assert(elm.firstChild.classList.contains('classes'));
  //   });
  //   it('can create elements with text content', function() {
  //     elm = patch(vnode0, h('div', ['I am a string'])).elm;
  //     assert.equal(elm.innerHTML, 'I am a string');
  //   });
  //   it('can create elements with span and text content', function() {
  //     elm = patch(vnode0, h('a', [h('span'), 'I am a string'])).elm;
  //     assert.equal(elm.childNodes[0].tagName, 'SPAN');
  //     assert.equal(elm.childNodes[1].textContent, 'I am a string');
  //   });
  //   it('can create elements with props', function() {
  //     elm = patch(vnode0, h('a', {props: {src: 'http://localhost/'}})).elm;
  //     assert.equal(elm.src, 'http://localhost/');
  //   });
  //   it('can create an element created inside an iframe', function(done) {
  //     // Only run if srcdoc is supported.
  //     var frame: any = document.createElement('iframe');
  //     if (typeof frame.srcdoc !== 'undefined') {
  //       frame.srcdoc = "<div>Thing 1</div>";
  //       frame.onload = function() {
  //         patch(frame.contentDocument.body.querySelector('div'), h('div', 'Thing 2'));
  //         assert.equal(frame.contentDocument.body.querySelector('div').textContent, 'Thing 2');
  //         frame.remove();
  //         done();
  //       };
  //       document.body.appendChild(frame);
  //     } else {
  //       done();
  //     }
  //   });
  //   it('is a patch of the root element', function () {
  //     var elmWithIdAndClass = document.createElement('div');
  //     elmWithIdAndClass.id = 'id';
  //     elmWithIdAndClass.className = 'class';
  //     var vnode1 = h('div#id.class', [h('span', 'Hi')]);
  //     elm = patch(elmWithIdAndClass, vnode1).elm;
  //     assert.strictEqual(elm, elmWithIdAndClass);
  //     assert.equal(elm.tagName, 'DIV');
  //     assert.equal(elm.id, 'id');
  //     assert.equal(elm.className, 'class');
  //   });
  //   it('can create comments', function() {
  //     elm = patch(vnode0, h('!', 'test')).elm;
  //     assert.equal(elm.nodeType, document.COMMENT_NODE);
  //     assert.equal(elm.textContent, 'test');
  //   });
  // });
  // describe('patching an element', function() {
  //   it('changes the elements classes', function() {
  //     var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
  //     var vnode2 = h('i', {class: {i: true, am: true, horse: false}});
  //     patch(vnode0, vnode1);
  //     elm = patch(vnode1, vnode2).elm;
  //     assert(elm.classList.contains('i'));
  //     assert(elm.classList.contains('am'));
  //     assert(!elm.classList.contains('horse'));
  //   });
  //   it('changes classes in selector', function() {
  //     var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
  //     var vnode2 = h('i', {class: {i: true, am: true, horse: false}});
  //     patch(vnode0, vnode1);
  //     elm = patch(vnode1, vnode2).elm;
  //     assert(elm.classList.contains('i'));
  //     assert(elm.classList.contains('am'));
  //     assert(!elm.classList.contains('horse'));
  //   });
  //   it('preserves memoized classes', function() {
  //     var cachedClass = {i: true, am: true, horse: false};
  //     var vnode1 = h('i', {class: cachedClass});
  //     var vnode2 = h('i', {class: cachedClass});
  //     elm = patch(vnode0, vnode1).elm;
  //     assert(elm.classList.contains('i'));
  //     assert(elm.classList.contains('am'));
  //     assert(!elm.classList.contains('horse'));
  //     elm = patch(vnode1, vnode2).elm;
  //     assert(elm.classList.contains('i'));
  //     assert(elm.classList.contains('am'));
  //     assert(!elm.classList.contains('horse'));
  //   });
  //   it('removes missing classes', function() {
  //     var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
  //     var vnode2 = h('i', {class: {i: true, am: true}});
  //     patch(vnode0, vnode1);
  //     elm = patch(vnode1, vnode2).elm;
  //     assert(elm.classList.contains('i'));
  //     assert(elm.classList.contains('am'));
  //     assert(!elm.classList.contains('horse'));
  //   });
  //   it('changes an elements props', function() {
  //     var vnode1 = h('a', {props: {src: 'http://other/'}});
  //     var vnode2 = h('a', {props: {src: 'http://localhost/'}});
  //     patch(vnode0, vnode1);
  //     elm = patch(vnode1, vnode2).elm;
  //     assert.equal(elm.src, 'http://localhost/');
  //   });
  //   it('preserves memoized props', function() {
  //     var cachedProps = {src: 'http://other/'};
  //     var vnode1 = h('a', {props: cachedProps});
  //     var vnode2 = h('a', {props: cachedProps});
  //     elm = patch(vnode0, vnode1).elm;
  //     assert.equal(elm.src, 'http://other/');
  //     elm = patch(vnode1, vnode2).elm;
  //     assert.equal(elm.src, 'http://other/');
  //   });
  //   it('removes an elements props', function() {
  //     var vnode1 = h('a', {props: {src: 'http://other/'}});
  //     var vnode2 = h('a');
  //     patch(vnode0, vnode1);
  //     patch(vnode1, vnode2);
  //     assert.equal(elm.src, undefined);
  //   });
  //   describe('using toVNode()', function () {
  //     it('can remove previous children of the root element', function () {
  //       var h2 = document.createElement('h2');
  //       h2.textContent = 'Hello'
  //       var prevElm = document.createElement('div');
  //       prevElm.id = 'id';
  //       prevElm.className = 'class';
  //       prevElm.appendChild(h2);
  //       var nextVNode = h('div#id.class', [h('span', 'Hi')]);
  //       elm = patch(toVNode(prevElm), nextVNode).elm;
  //       assert.strictEqual(elm, prevElm);
  //       assert.equal(elm.tagName, 'DIV');
  //       assert.equal(elm.id, 'id');
  //       assert.equal(elm.className, 'class');
  //       assert.strictEqual(elm.childNodes.length, 1);
  //       assert.strictEqual(elm.childNodes[0].tagName, 'SPAN');
  //       assert.strictEqual(elm.childNodes[0].textContent, 'Hi');
  //     });
  //     it('can remove some children of the root element', function () {
  //       var h2 = document.createElement('h2');
  //       h2.textContent = 'Hello'
  //       var prevElm = document.createElement('div');
  //       prevElm.id = 'id';
  //       prevElm.className = 'class';
  //       var text = new Text();
  //       text.data = 'Foobar';
  //       (<any>text).testProperty = function () {}; // ensures we dont recreate the Text Node
  //       prevElm.appendChild(text);
  //       prevElm.appendChild(h2);
  //       var nextVNode = h('div#id.class', ['Foobar']);
  //       elm = patch(toVNode(prevElm), nextVNode).elm;
  //       assert.strictEqual(elm, prevElm);
  //       assert.equal(elm.tagName, 'DIV');
  //       assert.equal(elm.id, 'id');
  //       assert.equal(elm.className, 'class');
  //       assert.strictEqual(elm.childNodes.length, 1);
  //       assert.strictEqual(elm.childNodes[0].nodeType, 3);
  //       assert.strictEqual(elm.childNodes[0].wholeText, 'Foobar');
  //       assert.strictEqual(typeof elm.childNodes[0].testProperty, 'function');
  //     });
  //     it('can remove text elements', function () {
  //       var h2 = document.createElement('h2');
  //       h2.textContent = 'Hello'
  //       var prevElm = document.createElement('div');
  //       prevElm.id = 'id';
  //       prevElm.className = 'class';
  //       var text = new Text();
  //       text.data = 'Foobar';
  //       prevElm.appendChild(text);
  //       prevElm.appendChild(h2);
  //       var nextVNode = h('div#id.class', [h('h2', 'Hello')]);
  //       elm = patch(toVNode(prevElm), nextVNode).elm;
  //       assert.strictEqual(elm, prevElm);
  //       assert.equal(elm.tagName, 'DIV');
  //       assert.equal(elm.id, 'id');
  //       assert.equal(elm.className, 'class');
  //       assert.strictEqual(elm.childNodes.length, 1);
  //       assert.strictEqual(elm.childNodes[0].nodeType, 1);
  //       assert.strictEqual(elm.childNodes[0].textContent, 'Hello');
  //     })
  //   });
  //   describe('updating children with keys', function() {
  //     function spanNum(n) {
  //       if (n == null) {
  //         return n;
  //       } else if (typeof n === 'string') {
  //         return h('span', {}, n);
  //       } else {
  //         return h('span', {key: n}, n.toString());
  //       }
  //     }
  //     describe('addition of elements', function() {
  //       it('appends elements', function() {
  //         var vnode1 = h('span', [1].map(spanNum));
  //         var vnode2 = h('span', [1, 2, 3].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 1);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 3);
  //         assert.equal(elm.children[1].innerHTML, '2');
  //         assert.equal(elm.children[2].innerHTML, '3');
  //       });
  //       it('prepends elements', function() {
  //         var vnode1 = h('span', [4, 5].map(spanNum));
  //         var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 2);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
  //       });
  //       it('add elements in the middle', function() {
  //         var vnode1 = h('span', [1, 2, 4, 5].map(spanNum));
  //         var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 4);
  //         assert.equal(elm.children.length, 4);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
  //       });
  //       it('add elements at begin and end', function() {
  //         var vnode1 = h('span', [2, 3, 4].map(spanNum));
  //         var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 3);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
  //       });
  //       it('adds children to parent with no children', function() {
  //         var vnode1 = h('span', {key: 'span'});
  //         var vnode2 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 0);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
  //       });
  //       it('removes all children from parent', function() {
  //         var vnode1 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
  //         var vnode2 = h('span', {key: 'span'});
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 0);
  //       });
  //       it('update one child with same key but different sel', function() {
  //         var vnode1 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
  //         var vnode2 = h('span', {key: 'span'}, [spanNum(1), h('i', {key: 2}, '2'), spanNum(3)]);
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
  //         assert.equal(elm.children.length, 3);
  //         assert.equal(elm.children[1].tagName, 'I');
  //       });
  //     });
  //     describe('removal of elements', function() {
  //       it('removes elements from the beginning', function() {
  //         var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
  //         var vnode2 = h('span', [3, 4, 5].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 5);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), ['3', '4', '5']);
  //       });
  //       it('removes elements from the end', function() {
  //         var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
  //         var vnode2 = h('span', [1, 2, 3].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 5);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 3);
  //         assert.equal(elm.children[0].innerHTML, '1');
  //         assert.equal(elm.children[1].innerHTML, '2');
  //         assert.equal(elm.children[2].innerHTML, '3');
  //       });
  //       it('removes elements from the middle', function() {
  //         var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
  //         var vnode2 = h('span', [1, 2, 4, 5].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 5);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 4);
  //         assert.deepEqual(elm.children[0].innerHTML, '1');
  //         assert.equal(elm.children[0].innerHTML, '1');
  //         assert.equal(elm.children[1].innerHTML, '2');
  //         assert.equal(elm.children[2].innerHTML, '4');
  //         assert.equal(elm.children[3].innerHTML, '5');
  //       });
  //     });
  //     describe('element reordering', function() {
  //       it('moves element forward', function() {
  //         var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
  //         var vnode2 = h('span', [2, 3, 1, 4].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 4);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 4);
  //         assert.equal(elm.children[0].innerHTML, '2');
  //         assert.equal(elm.children[1].innerHTML, '3');
  //         assert.equal(elm.children[2].innerHTML, '1');
  //         assert.equal(elm.children[3].innerHTML, '4');
  //       });
  //       it('moves element to end', function() {
  //         var vnode1 = h('span', [1, 2, 3].map(spanNum));
  //         var vnode2 = h('span', [2, 3, 1].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 3);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 3);
  //         assert.equal(elm.children[0].innerHTML, '2');
  //         assert.equal(elm.children[1].innerHTML, '3');
  //         assert.equal(elm.children[2].innerHTML, '1');
  //       });
  //       it('moves element backwards', function() {
  //         var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
  //         var vnode2 = h('span', [1, 4, 2, 3].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 4);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 4);
  //         assert.equal(elm.children[0].innerHTML, '1');
  //         assert.equal(elm.children[1].innerHTML, '4');
  //         assert.equal(elm.children[2].innerHTML, '2');
  //         assert.equal(elm.children[3].innerHTML, '3');
  //       });
  //       it('swaps first and last', function() {
  //         var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
  //         var vnode2 = h('span', [4, 2, 3, 1].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 4);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 4);
  //         assert.equal(elm.children[0].innerHTML, '4');
  //         assert.equal(elm.children[1].innerHTML, '2');
  //         assert.equal(elm.children[2].innerHTML, '3');
  //         assert.equal(elm.children[3].innerHTML, '1');
  //       });
  //     });
  //     describe('combinations of additions, removals and reorderings', function() {
  //       it('move to left and replace', function() {
  //         var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
  //         var vnode2 = h('span', [4, 1, 2, 3, 6].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 5);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 5);
  //         assert.equal(elm.children[0].innerHTML, '4');
  //         assert.equal(elm.children[1].innerHTML, '1');
  //         assert.equal(elm.children[2].innerHTML, '2');
  //         assert.equal(elm.children[3].innerHTML, '3');
  //         assert.equal(elm.children[4].innerHTML, '6');
  //       });
  //       it('moves to left and leaves hole', function() {
  //         var vnode1 = h('span', [1, 4, 5].map(spanNum));
  //         var vnode2 = h('span', [4, 6].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 3);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), ['4', '6']);
  //       });
  //       it('handles moved and set to undefined element ending at the end', function() {
  //         var vnode1 = h('span', [2, 4, 5].map(spanNum));
  //         var vnode2 = h('span', [4, 5, 3].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.children.length, 3);
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.children.length, 3);
  //         assert.equal(elm.children[0].innerHTML, '4');
  //         assert.equal(elm.children[1].innerHTML, '5');
  //         assert.equal(elm.children[2].innerHTML, '3');
  //       });
  //       it('moves a key in non-keyed nodes with a size up', function() {
  //         var vnode1 = h('span', [1, 'a', 'b', 'c'].map(spanNum));
  //         var vnode2 = h('span', ['d', 'a', 'b', 'c', 1, 'e'].map(spanNum));
  //         elm = patch(vnode0, vnode1).elm;
  //         assert.equal(elm.childNodes.length, 4);
  //         assert.equal(elm.textContent, '1abc');
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.equal(elm.childNodes.length, 6);
  //         assert.equal(elm.textContent, 'dabc1e');
  //       });
  //     });
  //     it('reverses elements', function() {
  //       var vnode1 = h('span', [1, 2, 3, 4, 5, 6, 7, 8].map(spanNum));
  //       var vnode2 = h('span', [8, 7, 6, 5, 4, 3, 2, 1].map(spanNum));
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.children.length, 8);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(inner, elm.children), ['8', '7', '6', '5', '4', '3', '2', '1']);
  //     });
  //     it('something', function() {
  //       var vnode1 = h('span', [0, 1, 2, 3, 4, 5].map(spanNum));
  //       var vnode2 = h('span', [4, 3, 2, 1, 5, 0].map(spanNum));
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.children.length, 6);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(inner, elm.children), ['4', '3', '2', '1', '5', '0']);
  //     });
  //     it('handles random shuffles', function() {
  //       var n, i, arr = [], opacities = [], elms = 14, samples = 5;
  //       function spanNumWithOpacity(n, o) {
  //         return h('span', {key: n, style: {opacity: o}}, n.toString());
  //       }
  //       for (n = 0; n < elms; ++n) { arr[n] = n; }
  //       for (n = 0; n < samples; ++n) {
  //         var vnode1 = h('span', arr.map(function(n) {
  //           return spanNumWithOpacity(n, '1');
  //         }));
  //         var shufArr = shuffle(arr.slice(0));
  //         var elm: any = document.createElement('div');
  //         elm = patch(elm, vnode1).elm;
  //         for (i = 0; i < elms; ++i) {
  //           assert.equal(elm.children[i].innerHTML, i.toString());
  //           opacities[i] = Math.random().toFixed(5).toString();
  //         }
  //         var vnode2 = h('span', arr.map(function(n) {
  //           return spanNumWithOpacity(shufArr[n], opacities[n]);
  //         }));
  //         elm = patch(vnode1, vnode2).elm;
  //         for (i = 0; i < elms; ++i) {
  //           assert.equal(elm.children[i].innerHTML, shufArr[i].toString());
  //           assert.equal(opacities[i].indexOf(elm.children[i].style.opacity), 0);
  //         }
  //       }
  //     });
  //     it('supports null/undefined children', function() {
  //       var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
  //       var vnode2 = h('i', [null, 2, undefined, null, 1, 0, null, 5, 4, null, 3, undefined].map(spanNum));
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.children.length, 6);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(inner, elm.children), ['2', '1', '0', '5', '4', '3']);
  //     });
  //     it('supports all null/undefined children', function() {
  //       var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
  //       var vnode2 = h('i', [null, null, undefined, null, null, undefined]);
  //       var vnode3 = h('i', [5, 4, 3, 2, 1, 0].map(spanNum));
  //       patch(vnode0, vnode1);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.children.length, 0);
  //       elm = patch(vnode2, vnode3).elm;
  //       assert.deepEqual(map(inner, elm.children), ['5', '4', '3', '2', '1', '0']);
  //     });
  //     it('handles random shuffles with null/undefined children', function() {
  //       var i, j, r, len, arr, maxArrLen = 15, samples = 5, vnode1 = vnode0, vnode2;
  //       for (i = 0; i < samples; ++i, vnode1 = vnode2) {
  //         len = Math.floor(Math.random() * maxArrLen);
  //         arr = [];
  //         for (j = 0; j < len; ++j) {
  //           if ((r = Math.random()) < 0.5) arr[j] = String(j);
  //           else if (r < 0.75) arr[j] = null;
  //           else arr[j] = undefined;
  //         }
  //         shuffle(arr);
  //         vnode2 = h('div', arr.map(spanNum));
  //         elm = patch(vnode1, vnode2).elm;
  //         assert.deepEqual(map(inner, elm.children), arr.filter(function(x) {return x != null;}));
  //       }
  //     });
  //   });
  //   describe('updating children without keys', function() {
  //     it('appends elements', function() {
  //       var vnode1 = h('div', [h('span', 'Hello')]);
  //       var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.deepEqual(map(inner, elm.children), ['Hello']);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
  //     });
  //     it('handles unmoved text nodes', function() {
  //       var vnode1 = h('div', ['Text', h('span', 'Span')]);
  //       var vnode2 = h('div', ['Text', h('span', 'Span')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text');
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text');
  //     });
  //     it('handles changing text children', function() {
  //       var vnode1 = h('div', ['Text', h('span', 'Span')]);
  //       var vnode2 = h('div', ['Text2', h('span', 'Span')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text');
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text2');
  //     });
  //     it('handles unmoved comment nodes', function() {
  //       var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
  //       var vnode2 = h('div', [h('!', 'Text'), h('span', 'Span')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text');
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text');
  //     });
  //     it('handles changing comment text', function() {
  //       var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
  //       var vnode2 = h('div', [h('!', 'Text2'), h('span', 'Span')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text');
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Text2');
  //     });
  //     it('handles changing empty comment', function() {
  //       var vnode1 = h('div', [h('!'), h('span', 'Span')]);
  //       var vnode2 = h('div', [h('!', 'Test'), h('span', 'Span')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.childNodes[0].textContent, '');
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.childNodes[0].textContent, 'Test');
  //     });
  //     it('prepends element', function() {
  //       var vnode1 = h('div', [h('span', 'World')]);
  //       var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.deepEqual(map(inner, elm.children), ['World']);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
  //     });
  //     it('prepends element of different tag type', function() {
  //       var vnode1 = h('div', [h('span', 'World')]);
  //       var vnode2 = h('div', [h('div', 'Hello'), h('span', 'World')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.deepEqual(map(inner, elm.children), ['World']);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(prop('tagName'), elm.children), ['DIV', 'SPAN']);
  //       assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
  //     });
  //     it('removes elements', function() {
  //       var vnode1 = h('div', [h('span', 'One'), h('span', 'Two'), h('span', 'Three')]);
  //       var vnode2 = h('div', [h('span', 'One'), h('span', 'Three')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(inner, elm.children), ['One', 'Three']);
  //     });
  //     it('removes a single text node', function() {
  //       var vnode1 = h('div', 'One');
  //       var vnode2 = h('div');
  //       patch(vnode0, vnode1);
  //       assert.equal(elm.textContent, 'One');
  //       patch(vnode1, vnode2);
  //       assert.equal(elm.textContent, '');
  //     });
  //     it('removes a single text node when children are updated', function() {
  //       var vnode1 = h('div', 'One');
  //       var vnode2 = h('div', [ h('div', 'Two'), h('span', 'Three') ]);
  //       patch(vnode0, vnode1);
  //       assert.equal(elm.textContent, 'One');
  //       patch(vnode1, vnode2);
  //       assert.deepEqual(map(prop('textContent'), elm.childNodes), ['Two', 'Three']);
  //     });
  //     it('removes a text node among other elements', function() {
  //       var vnode1 = h('div', [ 'One', h('span', 'Two') ]);
  //       var vnode2 = h('div', [ h('div', 'Three')]);
  //       patch(vnode0, vnode1);
  //       assert.deepEqual(map(prop('textContent'), elm.childNodes), ['One', 'Two']);
  //       patch(vnode1, vnode2);
  //       assert.equal(elm.childNodes.length, 1);
  //       assert.equal(elm.childNodes[0].tagName, 'DIV');
  //       assert.equal(elm.childNodes[0].textContent, 'Three');
  //     });
  //     it('reorders elements', function() {
  //       var vnode1 = h('div', [h('span', 'One'), h('div', 'Two'), h('b', 'Three')]);
  //       var vnode2 = h('div', [h('b', 'Three'), h('span', 'One'), h('div', 'Two')]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(prop('tagName'), elm.children), ['B', 'SPAN', 'DIV']);
  //       assert.deepEqual(map(inner, elm.children), ['Three', 'One', 'Two']);
  //     });
  //     it('supports null/undefined children', function() {
  //       var vnode1 = h('i', [null, h('i', '1'), h('i', '2'), null]);
  //       var vnode2 = h('i', [h('i', '2'), undefined, undefined, h('i', '1'), undefined]);
  //       var vnode3 = h('i', [null, h('i', '1'), undefined, null, h('i', '2'), undefined, null]);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.deepEqual(map(inner, elm.children), ['1', '2']);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.deepEqual(map(inner, elm.children), ['2', '1']);
  //       elm = patch(vnode2, vnode3).elm;
  //       assert.deepEqual(map(inner, elm.children), ['1', '2']);
  //     });
  //     it('supports all null/undefined children', function() {
  //       var vnode1 = h('i', [h('i', '1'), h('i', '2')]);
  //       var vnode2 = h('i', [null, undefined]);
  //       var vnode3 = h('i', [h('i', '2'), h('i', '1')]);
  //       patch(vnode0, vnode1);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.children.length, 0);
  //       elm = patch(vnode2, vnode3).elm;
  //       assert.deepEqual(map(inner, elm.children), ['2', '1']);
  //     });
  //   });
  // });
  // describe('hooks', function() {
  //   describe('element hooks', function() {
  //     it('calls `create` listener before inserted into parent but after children', function() {
  //       var result = [];
  //       function cb(empty, vnode) {
  //         assert(vnode.elm instanceof Element);
  //         assert.equal(vnode.elm.children.length, 2);
  //         assert.strictEqual(vnode.elm.parentNode, null);
  //         result.push(vnode);
  //       }
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {create: cb}}, [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //         h('span', 'Can\'t touch me'),
  //       ]);
  //       patch(vnode0, vnode1);
  //       assert.equal(1, result.length);
  //     });
  //     it('calls `insert` listener after both parents, siblings and children have been inserted', function() {
  //       var result = [];
  //       function cb(vnode) {
  //         assert(vnode.elm instanceof Element);
  //         assert.equal(vnode.elm.children.length, 2);
  //         assert.equal(vnode.elm.parentNode.children.length, 3);
  //         result.push(vnode);
  //       }
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {insert: cb}}, [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //         h('span', 'Can touch me'),
  //       ]);
  //       patch(vnode0, vnode1);
  //       assert.equal(1, result.length);
  //     });
  //     it('calls `prepatch` listener', function() {
  //       var result = [];
  //       function cb(oldVnode, vnode) {
  //         assert.strictEqual(oldVnode, vnode1.children[1]);
  //         assert.strictEqual(vnode, vnode2.children[1]);
  //         result.push(vnode);
  //       }
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {prepatch: cb}}, [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //       ]);
  //       var vnode2 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {prepatch: cb}}, [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //       ]);
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(result.length, 1);
  //     });
  //     it('calls `postpatch` after `prepatch` listener', function() {
  //       var pre = [], post = [];
  //       function preCb(oldVnode, vnode) {
  //         pre.push(pre);
  //       }
  //       function postCb(oldVnode, vnode) {
  //         assert.equal(pre.length, post.length + 1);
  //         post.push(post);
  //       }
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //       ]);
  //       var vnode2 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //       ]);
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(pre.length, 1);
  //       assert.equal(post.length, 1);
  //     });
  //     it('calls `update` listener', function() {
  //       var result1 = [];
  //       var result2 = [];
  //       function cb(result, oldVnode, vnode) {
  //         if (result.length > 0) {
  //           console.log(result[result.length-1]);
  //           console.log(oldVnode);
  //           assert.strictEqual(result[result.length-1], oldVnode);
  //         }
  //         result.push(vnode);
  //       }
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {update: cb.bind(null, result1)}}, [
  //           h('span', 'Child 1'),
  //           h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
  //         ]),
  //       ]);
  //       var vnode2 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {update: cb.bind(null, result1)}}, [
  //           h('span', 'Child 1'),
  //           h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
  //         ]),
  //       ]);
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(result1.length, 1);
  //       assert.equal(result2.length, 1);
  //     });
  //     it('calls `remove` listener', function() {
  //       var result = [];
  //       function cb(vnode, rm) {
  //         var parent = vnode.elm.parentNode;
  //         assert(vnode.elm instanceof Element);
  //         assert.equal(vnode.elm.children.length, 2);
  //         assert.equal(parent.children.length, 2);
  //         result.push(vnode);
  //         rm();
  //         assert.equal(parent.children.length, 1);
  //       }
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', {hook: {remove: cb}}, [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //       ]);
  //       var vnode2 = h('div', [
  //         h('span', 'First sibling'),
  //       ]);
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(1, result.length);
  //     });
  //     it('calls `init` and `prepatch` listeners on root', function() {
  //         var count = 0;
  //         function init(vnode) {
  //           assert.strictEqual(vnode, vnode2);
  //           count += 1;
  //         }
  //         function prepatch(oldVnode, vnode) {
  //           assert.strictEqual(vnode, vnode1);
  //           count += 1;
  //         }
  //         var vnode1 = h('div', {hook: {init: init, prepatch: prepatch}});
  //         patch(vnode0, vnode1);
  //         assert.equal(1, count);
  //         var vnode2 = h('span', {hook: {init: init, prepatch: prepatch}});
  //         patch(vnode1, vnode2);
  //         assert.equal(2, count);
  //     });
  //     it('removes element when all remove listeners are done', function() {
  //       var rm1, rm2, rm3;
  //       var patch = snabbdom.init([
  //         {remove: function(_, rm) { rm1 = rm; }},
  //         {remove: function(_, rm) { rm2 = rm; }},
  //       ]);
  //       var vnode1 = h('div', [h('a', {hook: {remove: function(_, rm) { rm3 = rm; }}})]);
  //       var vnode2 = h('div', []);
  //       elm = patch(vnode0, vnode1).elm;
  //       assert.equal(elm.children.length, 1);
  //       elm = patch(vnode1, vnode2).elm;
  //       assert.equal(elm.children.length, 1);
  //       rm1();
  //       assert.equal(elm.children.length, 1);
  //       rm3();
  //       assert.equal(elm.children.length, 1);
  //       rm2();
  //       assert.equal(elm.children.length, 0);
  //     });
  //     it('invokes remove hook on replaced root', function() {
  //       var result = [];
  //       var parent = document.createElement('div');
  //       var vnode0 = document.createElement('div');
  //       parent.appendChild(vnode0);
  //       function cb(vnode, rm) {
  //         result.push(vnode);
  //         rm();
  //       }
  //       var vnode1 = h('div', {hook: {remove: cb}}, [
  //         h('b', 'Child 1'),
  //         h('i', 'Child 2'),
  //       ]);
  //       var vnode2 = h('span', [
  //         h('b', 'Child 1'),
  //         h('i', 'Child 2'),
  //       ]);
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(1, result.length);
  //     });
  //   });
  //   describe('module hooks', function() {
  //     it('invokes `pre` and `post` hook', function() {
  //       var result = [];
  //       var patch = snabbdom.init([
  //         {pre: function() { result.push('pre'); }},
  //         {post: function() { result.push('post'); }},
  //       ]);
  //       var vnode1 = h('div');
  //       patch(vnode0, vnode1);
  //       assert.deepEqual(result, ['pre', 'post']);
  //     });
  //     it('invokes global `destroy` hook for all removed children', function() {
  //       var result = [];
  //       function cb(vnode) { result.push(vnode); }
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', [
  //           h('span', {hook: {destroy: cb}}, 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //       ]);
  //       var vnode2 = h('div');
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(result.length, 1);
  //     });
  //     it('handles text vnodes with `undefined` `data` property', function() {
  //       var vnode1 = h('div', [
  //         ' '
  //       ]);
  //       var vnode2 = h('div', []);
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //     });
  //     it('invokes `destroy` module hook for all removed children', function() {
  //       var created = 0;
  //       var destroyed = 0;
  //       var patch = snabbdom.init([
  //         {create: function() { created++; }},
  //         {destroy: function() { destroyed++; }},
  //       ]);
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', [
  //           h('span', 'Child 1'),
  //           h('span', 'Child 2'),
  //         ]),
  //       ]);
  //       var vnode2 = h('div');
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(created, 4);
  //       assert.equal(destroyed, 4);
  //     });
  //     it('does not invoke `create` and `remove` module hook for text nodes', function() {
  //       var created = 0;
  //       var removed = 0;
  //       var patch = snabbdom.init([
  //         {create: function() { created++; }},
  //         {remove: function() { removed++; }},
  //       ]);
  //       var vnode1 = h('div', [
  //         h('span', 'First child'),
  //         '',
  //         h('span', 'Third child'),
  //       ]);
  //       var vnode2 = h('div');
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(created, 2);
  //       assert.equal(removed, 2);
  //     });
  //     it('does not invoke `destroy` module hook for text nodes', function() {
  //       var created = 0;
  //       var destroyed = 0;
  //       var patch = snabbdom.init([
  //         {create: function() { created++; }},
  //         {destroy: function() { destroyed++; }},
  //       ]);
  //       var vnode1 = h('div', [
  //         h('span', 'First sibling'),
  //         h('div', [
  //           h('span', 'Child 1'),
  //           h('span', ['Text 1', 'Text 2']),
  //         ]),
  //       ]);
  //       var vnode2 = h('div');
  //       patch(vnode0, vnode1);
  //       patch(vnode1, vnode2);
  //       assert.equal(created, 4);
  //       assert.equal(destroyed, 4);
  //     });
  //   });
  // });
  // describe('short circuiting', function() {
  //   it('does not update strictly equal vnodes', function() {
  //     var result = [];
  //     function cb(vnode) { result.push(vnode); }
  //     var vnode1 = h('div', [
  //       h('span', {hook: {update: cb}}, 'Hello'),
  //       h('span', 'there'),
  //     ]);
  //     patch(vnode0, vnode1);
  //     patch(vnode1, vnode1);
  //     assert.equal(result.length, 0);
  //   });
  //   it('does not update strictly equal children', function() {
  //     var result = [];
  //     function cb(vnode) { result.push(vnode); }
  //     var vnode1 = h('div', [
  //       h('span', (<VNodeData>{hook: {patch: cb}}), 'Hello'),
  //       h('span', 'there'),
  //     ]);
  //     var vnode2 = h('div');
  //     vnode2.children = vnode1.children;
  //     patch(vnode0, vnode1);
  //     patch(vnode1, vnode2);
  //     assert.equal(result.length, 0);
  //   });
  // });
});



function toVNode(node: Node, domApi?: DomApi): VNode {
  if (!domApi) {
    domApi = new BrowserDomApi(document);
  }

  let text: string;
  if (domApi.isElement(node)) {
    const id = node.id ? '#' + node.id : '';
    const cn = node.getAttribute('class');
    const c = cn ? '.' + cn.split(' ').join('.') : '';
    const sel = domApi.tag(node).toLowerCase() + id + c;
    const attrs: any = {};
    const children: Array<VNode> = [];
    let name: string;
    let i: number, n: number;
    const elmAttrs = node.attributes;
    const elmChildren = node.childNodes;
    for (i = 0, n = elmAttrs.length; i < n; i++) {
      name = elmAttrs[i].nodeName;
      if (name !== 'id' && name !== 'class') {
        attrs[name] = elmAttrs[i].nodeValue;
      }
    }
    for (i = 0, n = elmChildren.length; i < n; i++) {
      children.push(toVNode(elmChildren[i], domApi));
    }
    return vnode(sel, {attrs}, children, undefined, node);
  } else if (domApi.isText(node)) {
    text = domApi.getTextContent(node) as string;
    return vnode(undefined, undefined, undefined, text, node);
  } else if (domApi.isComment(node)) {
    text = domApi.getTextContent(node) as string;
    return vnode('!', undefined, undefined, text, undefined);
  } else {
    return vnode('', {}, [], undefined, undefined);
  }
}

