import { initRenderer, h, vnode, VNode, VNodeData } from '../core';
import { PlatformApi } from '../../util/interfaces';
import { PlatformClient } from '../../platform/platform-client';
import { knuthShuffle as shuffle} from 'knuth-shuffle';
import { DomController } from '../../platform/dom-controller';
import { NextTickController } from '../../platform/next-tick-controller';

const document: HTMLDocument = (<any>global).document;
var domCtrl = DomController(window);
var nextTick = NextTickController(window);
var patch = initRenderer(PlatformClient(window, document, {}, '/build', domCtrl, nextTick));


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
    it('can create vnode with children', function() {
      var vnode = h('div', [h('span#hello'), h('b.world')]);
      expect(vnode.sel).toEqual('div');
      expect((<VNode>vnode.vchildren[0]).sel).toEqual('span#hello');
      expect((<VNode>vnode.vchildren[1]).sel).toEqual('b.world');
    });
    it('can create vnode with one child vnode', function() {
      var vnode = h('div', h('span#hello'));
      expect(vnode.sel).toEqual('div');
      expect((<VNode>vnode.vchildren[0]).sel).toEqual('span#hello');
    });
    it('can create vnode with props and one child vnode', function() {
      var vnode = h('div', {}, h('span#hello'));
      expect(vnode.sel).toEqual('div');
      expect((<VNode>vnode.vchildren[0]).sel).toEqual('span#hello');
    });
    it('can create vnode with text content', function() {
      var vnode = h('a', ['I am a string']);
      expect((<VNode>vnode.vchildren[0]).vtext).toEqual('I am a string');
    });
    it('can create vnode with text content in string', function() {
      var vnode = h('a', 'I am a string');
      expect(vnode.vtext).toEqual('I am a string');
    });
    it('can create vnode with props and text content in string', function() {
      var vnode = h('a', {}, 'I am a string');
      expect(vnode.vtext).toEqual('I am a string');
    });
    it('can create vnode for comment', function() {
      var vnode = h('!', 'test');
      expect(vnode.sel).toEqual('!');
      expect(vnode.vtext).toEqual('test');
    });
  });
  describe('created element', function() {
    it('has tag', function() {
      elm = patch(vnode0, h('div')).elm;
      expect(elm.tagName).toEqual('DIV');
    });
    it('has different tag and id', function() {
      var elm: any = document.createElement('div');
      vnode0.appendChild(elm);
      var vnode1 = h('span#id');
      elm = patch(elm, vnode1).elm;
      expect(elm.tagName).toEqual('SPAN');
      expect(elm.id).toEqual('id');
    });
    it('has id', function() {
      elm = patch(vnode0, h('div', [h('div#unique')])).elm;
      expect(elm.firstChild.id).toEqual('unique');
    });
    it('has correct namespace', function() {
      var SVGNamespace = 'http://www.w3.org/2000/svg';
      var XHTMLNamespace = 'http://www.w3.org/1999/xhtml';

      elm = patch(vnode0, h('div', [h('div', {ns: SVGNamespace})])).elm;
      expect(elm.firstChild.namespaceURI).toEqual(SVGNamespace);

      // verify that svg tag automatically gets svg namespace
      elm = patch(vnode0, h('svg', [
        h('foreignObject', [
          h('div', ['I am HTML embedded in SVG'])
        ])
      ])).elm;
      expect(elm.namespaceURI).toEqual(SVGNamespace);
      expect(elm.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(elm.firstChild.firstChild.namespaceURI).toEqual(XHTMLNamespace);

      // verify that svg tag with extra selectors gets svg namespace
      elm = patch(vnode0, h('svg#some-id')).elm;
      expect(elm.namespaceURI).toEqual(SVGNamespace);

      // verify that non-svg tag beginning with 'svg' does NOT get namespace
      elm = patch(vnode0, h('svg-custom-el')).elm;
      expect(elm.namespaceURI).not.toEqual(SVGNamespace);
    });
    it('is receives classes in selector', function() {
      elm = patch(vnode0, h('div', [h('i.am.a.class')])).elm;
      expect(elm.firstChild.classList.contains('am')).toBeTruthy();
      expect(elm.firstChild.classList.contains('a')).toBeTruthy();
      expect(elm.firstChild.classList.contains('class')).toBeTruthy();
    });
    it('is receives classes in class property', function() {
      elm = patch(vnode0, h('i', {class: {am: true, a: true, class: true, not: false}})).elm;
      expect(elm.classList.contains('am')).toBeTruthy();
      expect(elm.classList.contains('a')).toBeTruthy();
      expect(elm.classList.contains('class')).toBeTruthy();
      expect(!elm.classList.contains('not')).toBeTruthy();
    });
    it('handles classes from both selector and property', function() {
      elm = patch(vnode0, h('div', [h('i.has', {class: {classes: true}})])).elm;
      expect(elm.firstChild.classList.contains('has')).toBeTruthy();
      expect(elm.firstChild.classList.contains('classes')).toBeTruthy();
    });
    it('can create elements with text content', function() {
      elm = patch(vnode0, h('div', ['I am a string'])).elm;
      expect(elm.innerHTML).toEqual('I am a string');
    });
    it('can create elements with span and text content', function() {
      elm = patch(vnode0, h('a', [h('span'), 'I am a string'])).elm;
      expect(elm.childNodes[0].tagName).toEqual('SPAN');
      expect(elm.childNodes[1].textContent).toEqual('I am a string');
    });
    it('is a patch of the root element', function () {
      var elmWithIdAndClass = document.createElement('div');
      elmWithIdAndClass.id = 'id';
      elmWithIdAndClass.className = 'class';
      var vnode1 = h('div#id.class', [h('span', 'Hi')]);
      elm = patch(elmWithIdAndClass, vnode1).elm;
      expect(elm).toEqual(elmWithIdAndClass);
      expect(elm.tagName).toEqual('DIV');
      expect(elm.id).toEqual('id');
      expect(elm.className).toEqual('class');
    });
    it('can create comments', function() {
      elm = patch(vnode0, h('!', 'test')).elm;
      expect(elm.nodeType).toEqual(document.COMMENT_NODE);
      expect(elm.textContent).toEqual('test');
    });
  });
  describe('patching an element', function() {
    it('changes the elements classes', function() {
      var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
      var vnode2 = h('i', {class: {i: true, am: true, horse: false}});
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      expect(elm.classList.contains('i')).toBeTruthy();
      expect(elm.classList.contains('am')).toBeTruthy();
      expect(!elm.classList.contains('horse')).toBeTruthy();
    });
    it('changes classes in selector', function() {
      var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
      var vnode2 = h('i', {class: {i: true, am: true, horse: false}});
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      expect(elm.classList.contains('i')).toBeTruthy();
      expect(elm.classList.contains('am')).toBeTruthy();
      expect(!elm.classList.contains('horse')).toBeTruthy();
    });
    it('preserves memoized classes', function() {
      var cachedClass = {i: true, am: true, horse: false};
      var vnode1 = h('i', {class: cachedClass});
      var vnode2 = h('i', {class: cachedClass});
      elm = patch(vnode0, vnode1).elm;
      expect(elm.classList.contains('i')).toBeTruthy();
      expect(elm.classList.contains('am')).toBeTruthy();
      expect(!elm.classList.contains('horse')).toBeTruthy();
      elm = patch(vnode1, vnode2).elm;
      expect(elm.classList.contains('i')).toBeTruthy();
      expect(elm.classList.contains('am')).toBeTruthy();
      expect(!elm.classList.contains('horse')).toBeTruthy();
    });
    it('removes missing classes', function() {
      var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
      var vnode2 = h('i', {class: {i: true, am: true}});
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      expect(elm.classList.contains('i')).toBeTruthy();
      expect(elm.classList.contains('am')).toBeTruthy();
      expect(!elm.classList.contains('horse')).toBeTruthy();
    });
    describe('using toVNode()', function () {
      it('can remove previous children of the root element', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', [h('span', 'Hi')]);
        elm = patch(toVNode(prevElm), nextVNode).elm;
        expect(elm).toEqual(prevElm);
        expect(elm.tagName).toEqual('DIV');
        expect(elm.id).toEqual('id');
        expect(elm.className).toEqual('class');
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].tagName).toEqual('SPAN');
        expect(elm.childNodes[0].textContent).toEqual('Hi');
      });
      it('can remove some children of the root element', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        var text = document.createTextNode('Foobar');
        (<any>text).testProperty = function () {}; // ensures we dont recreate the Text Node
        prevElm.appendChild(text);
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', ['Foobar']);
        elm = patch(toVNode(prevElm), nextVNode).elm;
        expect(elm).toEqual(prevElm);
        expect(elm.tagName).toEqual('DIV');
        expect(elm.id).toEqual('id');
        expect(elm.className).toEqual('class');
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].nodeType).toEqual(3);
        expect(elm.childNodes[0].wholeText).toEqual('Foobar');
        expect(typeof elm.childNodes[0].testProperty).toEqual('function');
      });
      it('can remove text elements', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        var text = document.createTextNode('Foobar');
        prevElm.appendChild(text);
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', [h('h2', 'Hello')]);
        elm = patch(toVNode(prevElm), nextVNode).elm;
        expect(elm).toEqual(prevElm);
        expect(elm.tagName).toEqual('DIV');
        expect(elm.id).toEqual('id');
        expect(elm.className).toEqual('class');
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].nodeType).toEqual(1);
        expect(elm.childNodes[0].textContent).toEqual('Hello');
      })
    });
    describe('updating children with keys', function() {
      function spanNum(n) {
        if (n == null) {
          return n;
        } else if (typeof n === 'string') {
          return h('span', {}, n);
        } else {
          return h('span', {vkey: n}, n.toString());
        }
      }
      describe('addition of elements', function() {
        it('appends elements', function() {
          var vnode1 = h('span', [1].map(spanNum));
          var vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(1);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);
          expect(elm.children[1].innerHTML).toEqual('2');
          expect(elm.children[2].innerHTML).toEqual('3');
        });
        it('prepends elements', function() {
          var vnode1 = h('span', [4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(2);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3', '4', '5']);
        });
        it('add elements in the middle', function() {
          var vnode1 = h('span', [1, 2, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(4);
          expect(elm.children.length).toEqual(4);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3', '4', '5']);
        });
        it('add elements at begin and end', function() {
          var vnode1 = h('span', [2, 3, 4].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3', '4', '5']);
        });
        it('adds children to parent with no children', function() {
          var vnode1 = h('span', {vkey: 'span'});
          var vnode2 = h('span', {vkey: 'span'}, [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(0);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
        });
        it('removes all children from parent', function() {
          var vnode1 = h('span', {vkey: 'span'}, [1, 2, 3].map(spanNum));
          var vnode2 = h('span', {vkey: 'span'});
          elm = patch(vnode0, vnode1).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(0);
        });
        it('update one child with same key but different sel', function() {
          var vnode1 = h('span', {vkey: 'span'}, [1, 2, 3].map(spanNum));
          var vnode2 = h('span', {vkey: 'span'}, [spanNum(1), h('i', {vkey: 2}, '2'), spanNum(3)]);
          elm = patch(vnode0, vnode1).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
          expect(elm.children.length).toEqual(3);
          expect(elm.children[1].tagName).toEqual('I');
        });
      });
      describe('removal of elements', function() {
        it('removes elements from the beginning', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(5);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['3', '4', '5']);
        });
        it('removes elements from the end', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(5);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);
          expect(elm.children[0].innerHTML).toEqual('1');
          expect(elm.children[1].innerHTML).toEqual('2');
          expect(elm.children[2].innerHTML).toEqual('3');
        });
        it('removes elements from the middle', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(5);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(4);
          expect(elm.children[0].innerHTML).toEqual('1');
          expect(elm.children[0].innerHTML).toEqual('1');
          expect(elm.children[1].innerHTML).toEqual('2');
          expect(elm.children[2].innerHTML).toEqual('4');
          expect(elm.children[3].innerHTML).toEqual('5');
        });
      });
      describe('element reordering', function() {
        it('moves element forward', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [2, 3, 1, 4].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(4);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(4);
          expect(elm.children[0].innerHTML).toEqual('2');
          expect(elm.children[1].innerHTML).toEqual('3');
          expect(elm.children[2].innerHTML).toEqual('1');
          expect(elm.children[3].innerHTML).toEqual('4');
        });
        it('moves element to end', function() {
          var vnode1 = h('span', [1, 2, 3].map(spanNum));
          var vnode2 = h('span', [2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);
          expect(elm.children[0].innerHTML).toEqual('2');
          expect(elm.children[1].innerHTML).toEqual('3');
          expect(elm.children[2].innerHTML).toEqual('1');
        });
        it('moves element backwards', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [1, 4, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(4);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(4);
          expect(elm.children[0].innerHTML).toEqual('1');
          expect(elm.children[1].innerHTML).toEqual('4');
          expect(elm.children[2].innerHTML).toEqual('2');
          expect(elm.children[3].innerHTML).toEqual('3');
        });
        it('swaps first and last', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [4, 2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(4);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(4);
          expect(elm.children[0].innerHTML).toEqual('4');
          expect(elm.children[1].innerHTML).toEqual('2');
          expect(elm.children[2].innerHTML).toEqual('3');
          expect(elm.children[3].innerHTML).toEqual('1');
        });
      });
      describe('combinations of additions, removals and reorderings', function() {
        it('move to left and replace', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 1, 2, 3, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(5);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(5);
          expect(elm.children[0].innerHTML).toEqual('4');
          expect(elm.children[1].innerHTML).toEqual('1');
          expect(elm.children[2].innerHTML).toEqual('2');
          expect(elm.children[3].innerHTML).toEqual('3');
          expect(elm.children[4].innerHTML).toEqual('6');
        });
        it('moves to left and leaves hole', function() {
          var vnode1 = h('span', [1, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['4', '6']);
        });
        it('handles moved and set to undefined element ending at the end', function() {
          var vnode1 = h('span', [2, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 5, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);
          expect(elm.children[0].innerHTML).toEqual('4');
          expect(elm.children[1].innerHTML).toEqual('5');
          expect(elm.children[2].innerHTML).toEqual('3');
        });
        it('moves a key in non-keyed nodes with a size up', function() {
          var vnode1 = h('span', [1, 'a', 'b', 'c'].map(spanNum));
          var vnode2 = h('span', ['d', 'a', 'b', 'c', 1, 'e'].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.childNodes.length).toEqual(4);
          expect(elm.textContent).toEqual('1abc');
          elm = patch(vnode1, vnode2).elm;
          expect(elm.childNodes.length).toEqual(6);
          expect(elm.textContent).toEqual('dabc1e');
        });
      });
      it('reverses elements', function() {
        var vnode1 = h('span', [1, 2, 3, 4, 5, 6, 7, 8].map(spanNum));
        var vnode2 = h('span', [8, 7, 6, 5, 4, 3, 2, 1].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        expect(elm.children.length).toEqual(8);
        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['8', '7', '6', '5', '4', '3', '2', '1']);
      });
      it('something', function() {
        var vnode1 = h('span', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('span', [4, 3, 2, 1, 5, 0].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        expect(elm.children.length).toEqual(6);
        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['4', '3', '2', '1', '5', '0']);
      });
      it('handles random shuffles', function() {
        var n, i, arr = [], opacities = [], elms = 14, samples = 5;
        function spanNumWithOpacity(n, o) {
          return h('span', {vkey: n, style: {opacity: o}}, n.toString());
        }
        for (n = 0; n < elms; ++n) { arr[n] = n; }
        for (n = 0; n < samples; ++n) {
          var vnode1 = h('span', arr.map(function(n) {
            return spanNumWithOpacity(n, '1');
          }));
          var shufArr = shuffle(arr.slice(0));
          var elm: any = document.createElement('div');
          elm = patch(elm, vnode1).elm;
          for (i = 0; i < elms; ++i) {
            expect(elm.children[i].innerHTML).toEqual(i.toString());
            opacities[i] = Math.random().toFixed(5).toString();
          }
          var vnode2 = h('span', arr.map(function(n) {
            return spanNumWithOpacity(shufArr[n], opacities[n]);
          }));
          elm = patch(vnode1, vnode2).elm;
          for (i = 0; i < elms; ++i) {
            expect(elm.children[i].innerHTML).toEqual(shufArr[i].toString());
            expect(opacities[i].indexOf(elm.children[i].style.opacity)).toEqual(0);
          }
        }
      });
      it('supports null/undefined children', function() {
        var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('i', [null, 2, undefined, null, 1, 0, null, 5, 4, null, 3, undefined].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        expect(elm.children.length).toEqual(6);
        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['2', '1', '0', '5', '4', '3']);
      });
      it('supports all null/undefined children', function() {
        var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('i', [null, null, undefined, null, null, undefined]);
        var vnode3 = h('i', [5, 4, 3, 2, 1, 0].map(spanNum));
        patch(vnode0, vnode1);
        elm = patch(vnode1, vnode2).elm;
        expect(elm.children.length).toEqual(0);
        elm = patch(vnode2, vnode3).elm;
        expect(map(inner, elm.children)).toEqual(['5', '4', '3', '2', '1', '0']);
      });
      it('handles random shuffles with null/undefined children', function() {
        var i, j, r, len, arr, maxArrLen = 15, samples = 5, vnode1 = vnode0, vnode2;
        for (i = 0; i < samples; ++i, vnode1 = vnode2) {
          len = Math.floor(Math.random() * maxArrLen);
          arr = [];
          for (j = 0; j < len; ++j) {
            if ((r = Math.random()) < 0.5) arr[j] = String(j);
            else if (r < 0.75) arr[j] = null;
            else arr[j] = undefined;
          }
          shuffle(arr);
          vnode2 = h('div', arr.map(spanNum));
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(arr.filter(function(x) {return x != null;}));
        }
      });
    });
    describe('updating children without keys', function() {
      it('appends elements', function() {
        var vnode1 = h('div', [h('span', 'Hello')]);
        var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['Hello']);
        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['Hello', 'World']);
      });
      it('handles unmoved text nodes', function() {
        var vnode1 = h('div', ['Text', h('span', 'Span')]);
        var vnode2 = h('div', ['Text', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');
        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');
      });
      it('handles changing text children', function() {
        var vnode1 = h('div', ['Text', h('span', 'Span')]);
        var vnode2 = h('div', ['Text2', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');
        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text2');
      });
      it('handles unmoved comment nodes', function() {
        var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');
        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');
      });
      it('handles changing comment text', function() {
        var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Text2'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');
        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text2');
      });
      it('handles changing empty comment', function() {
        var vnode1 = h('div', [h('!'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Test'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        expect(elm.childNodes[0].textContent).toEqual('');
        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes[0].textContent).toEqual('Test');
      });
      it('prepends element', function() {
        var vnode1 = h('div', [h('span', 'World')]);
        var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['World']);
        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['Hello', 'World']);
      });
      it('prepends element of different tag type', function() {
        var vnode1 = h('div', [h('span', 'World')]);
        var vnode2 = h('div', [h('div', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['World']);
        elm = patch(vnode1, vnode2).elm;
        expect(map(prop('tagName'), elm.children)).toEqual(['DIV', 'SPAN']);
        expect(map(inner, elm.children)).toEqual(['Hello', 'World']);
      });
      it('removes elements', function() {
        var vnode1 = h('div', [h('span', 'One'), h('span', 'Two'), h('span', 'Three')]);
        var vnode2 = h('div', [h('span', 'One'), h('span', 'Three')]);
        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['One', 'Three']);
      });
      it('removes a single text node', function() {
        var vnode1 = h('div', 'One');
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        expect(elm.textContent).toEqual('One');
        patch(vnode1, vnode2);
        expect(elm.textContent).toEqual('');
      });
      it('removes a single text node when children are updated', function() {
        var vnode1 = h('div', 'One');
        var vnode2 = h('div', [ h('div', 'Two'), h('span', 'Three') ]);
        patch(vnode0, vnode1);
        expect(elm.textContent).toEqual('One');
        patch(vnode1, vnode2);
        expect(map(prop('textContent'), elm.childNodes)).toEqual(['Two', 'Three']);
      });
      it('removes a text node among other elements', function() {
        var vnode1 = h('div', [ 'One', h('span', 'Two') ]);
        var vnode2 = h('div', [ h('div', 'Three')]);
        patch(vnode0, vnode1);
        expect(map(prop('textContent'), elm.childNodes)).toEqual(['One', 'Two']);
        patch(vnode1, vnode2);
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].tagName).toEqual('DIV');
        expect(elm.childNodes[0].textContent).toEqual('Three');
      });
      it('reorders elements', function() {
        var vnode1 = h('div', [h('span', 'One'), h('div', 'Two'), h('b', 'Three')]);
        var vnode2 = h('div', [h('b', 'Three'), h('span', 'One'), h('div', 'Two')]);
        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm;
        expect(map(prop('tagName'), elm.children)).toEqual(['B', 'SPAN', 'DIV']);
        expect(map(inner, elm.children)).toEqual(['Three', 'One', 'Two']);
      });
      it('supports null/undefined children', function() {
        var vnode1 = h('i', [null, h('i', '1'), h('i', '2'), null]);
        var vnode2 = h('i', [h('i', '2'), undefined, undefined, h('i', '1'), undefined]);
        var vnode3 = h('i', [null, h('i', '1'), undefined, null, h('i', '2'), undefined, null]);
        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['1', '2']);
        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['2', '1']);
        elm = patch(vnode2, vnode3).elm;
        expect(map(inner, elm.children)).toEqual(['1', '2']);
      });
      it('supports all null/undefined children', function() {
        var vnode1 = h('i', [h('i', '1'), h('i', '2')]);
        var vnode2 = h('i', [null, undefined]);
        var vnode3 = h('i', [h('i', '2'), h('i', '1')]);
        patch(vnode0, vnode1);
        elm = patch(vnode1, vnode2).elm;
        expect(elm.children.length).toEqual(0);
        elm = patch(vnode2, vnode3).elm;
        expect(map(inner, elm.children)).toEqual(['2', '1']);
      });
    });
  });
  describe('hooks', function() {
    describe('element hooks', function() {
      it('calls `create` listener before inserted into parent but after children', function() {
        var result = [];
        function cb(empty, vnode) {
          empty;
          expect(vnode.elm.nodeType).toEqual(1);
          expect(vnode.elm.children.length).toEqual(2);
          expect(vnode.elm.parentNode).toEqual(null);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {create: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
          h('span', 'Can\'t touch me'),
        ]);
        patch(vnode0, vnode1);
        expect(1).toEqual(result.length);
      });
      // it('calls `insert` listener after both parents, siblings and children have been inserted', function() {
      //   var result = [];
      //   function cb(vnode) {
      //     expect(vnode.elm.nodeType).toEqual(1);
      //     expect(vnode.elm.children.length).toEqual(2);
      //     expect(vnode.elm.parentNode.children.length).toEqual(3);
      //     result.push(vnode);
      //   }
      //   var vnode1 = h('div', [
      //     h('span', 'First sibling'),
      //     h('div', {hook: {insert: cb}}, [
      //       h('span', 'Child 1'),
      //       h('span', 'Child 2'),
      //     ]),
      //     h('span', 'Can touch me'),
      //   ]);
      //   patch(vnode0, vnode1);
      //   expect(1).toEqual(result.length);
      // });
      it('calls `prepatch` listener', function() {
        var result = [];
        function cb(oldVnode, vnode) {
          expect(oldVnode).toEqual(vnode1.vchildren[1]);
          expect(vnode).toEqual(vnode2.vchildren[1]);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        expect(result.length).toEqual(1);
      });
      it('calls `postpatch` after `prepatch` listener', function() {
        var pre = [], post = [];
        function preCb() {
          pre.push(pre);
        }
        function postCb() {
          expect(pre.length).toEqual(post.length + 1);
          post.push(post);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        expect(pre.length).toEqual(1);
        expect(post.length).toEqual(1);
      });
      it('calls `update` listener', function() {
        var result1 = [];
        var result2 = [];
        function cb(result, oldVnode, vnode) {
          if (result.length > 0) {
            console.log(result[result.length-1]);
            console.log(oldVnode);
            expect(result[result.length-1]).toEqual(oldVnode);
          }
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {update: cb.bind(null, result1)}}, [
            h('span', 'Child 1'),
            h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {update: cb.bind(null, result1)}}, [
            h('span', 'Child 1'),
            h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        expect(result1.length).toEqual(1);
        expect(result2.length).toEqual(1);
      });
      it('calls `remove` listener', function() {
        var result = [];
        function cb(vnode, rm) {
          var parent = vnode.elm.parentNode;
          expect(vnode.elm.nodeType).toEqual(1);
          expect(vnode.elm.children.length).toEqual(2);
          expect(parent.children.length).toEqual(2);
          result.push(vnode);
          rm();
          expect(parent.children.length).toEqual(1);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {remove: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        expect(1).toEqual(result.length);
      });
      it('calls `init` and `prepatch` listeners on root', function() {
          var count = 0;
          function init(vnode) {
            expect(vnode).toEqual(vnode2);
            count += 1;
          }
          function prepatch(oldVnode, vnode) {
            oldVnode;
            expect(vnode).toEqual(vnode1);
            count += 1;
          }
          var vnode1 = h('div', {hook: {init: init, prepatch: prepatch}});
          patch(vnode0, vnode1);
          expect(1).toEqual(count);
          var vnode2 = h('span', {hook: {init: init, prepatch: prepatch}});
          patch(vnode1, vnode2);
          expect(2).toEqual(count);
      });
      // it('removes element when all remove listeners are done', function() {
      //   var rm1, rm2, rm3;
      //   var patch = initRenderer(api);
      //   var vnode1 = h('div', [h('a', {hook: {remove: function(_, rm) { rm3 = rm; }}})]);
      //   var vnode2 = h('div', []);
      //   elm = patch(vnode0, vnode1).elm;
      //   expect(elm.children.length).toEqual(1);
      //   elm = patch(vnode1, vnode2).elm;
      //   expect(elm.children.length).toEqual(1);
      //   rm1();
      //   expect(elm.children.length).toEqual(1);
      //   rm3();
      //   expect(elm.children.length).toEqual(1);
      //   rm2();
      //   expect(elm.children.length).toEqual(0);
      // });
      it('invokes remove hook on replaced root', function() {
        var result = [];
        var parent = document.createElement('div');
        var vnode0 = document.createElement('div');
        parent.appendChild(vnode0);
        function cb(vnode, rm) {
          result.push(vnode);
          rm();
        }
        var vnode1 = h('div', {hook: {remove: cb}}, [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        var vnode2 = h('span', [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        expect(1).toEqual(result.length);
      });
    });
    describe('module hooks', function() {
      // it('invokes `pre` and `post` hook', function() {
      //   var result = [];
      //   var patch = initRenderer([
      //     {pre: function() { result.push('pre'); }},
      //     {post: function() { result.push('post'); }},
      //   ], api);
      //   var vnode1 = h('div');
      //   patch(vnode0, vnode1);
      //   expect(result).toEqual(['pre', 'post']);
      // });
      // it('invokes global `destroy` hook for all removed children', function() {
      //   var result = [];
      //   function cb(vnode) { result.push(vnode); }
      //   var vnode1 = h('div', [
      //     h('span', 'First sibling'),
      //     h('div', [
      //       h('span', {hook: {destroy: cb}}, 'Child 1'),
      //       h('span', 'Child 2'),
      //     ]),
      //   ]);
      //   var vnode2 = h('div');
      //   patch(vnode0, vnode1);
      //   patch(vnode1, vnode2);
      //   expect(result.length).toEqual(1);
      // });
      it('handles text vnodes with `undefined` `data` property', function() {
        var vnode1 = h('div', [
          ' '
        ]);
        var vnode2 = h('div', []);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
      });
      // it('invokes `destroy` module hook for all removed children', function() {
      //   var created = 0;
      //   var destroyed = 0;
      //   var patch = initRenderer([
      //     {create: function() { created++; }},
      //     {destroy: function() { destroyed++; }},
      //   ], api);
      //   var vnode1 = h('div', [
      //     h('span', 'First sibling'),
      //     h('div', [
      //       h('span', 'Child 1'),
      //       h('span', 'Child 2'),
      //     ]),
      //   ]);
      //   var vnode2 = h('div');
      //   patch(vnode0, vnode1);
      //   patch(vnode1, vnode2);
      //   expect(created).toEqual(4);
      //   expect(destroyed).toEqual(4);
      // });
      // it('does not invoke `create` and `remove` module hook for text nodes', function() {
      //   var created = 0;
      //   var removed = 0;
      //   var patch = initRenderer([
      //     {create: function() { created++; }},
      //     {remove: function() { removed++; }},
      //   ], api);
      //   var vnode1 = h('div', [
      //     h('span', 'First child'),
      //     '',
      //     h('span', 'Third child'),
      //   ]);
      //   var vnode2 = h('div');
      //   patch(vnode0, vnode1);
      //   patch(vnode1, vnode2);
      //   expect(created).toEqual(2);
      //   expect(removed).toEqual(2);
      // });
      // it('does not invoke `destroy` module hook for text nodes', function() {
      //   var created = 0;
      //   var destroyed = 0;
      //   var patch = initRenderer([
      //     {create: function() { created++; }},
      //     {destroy: function() { destroyed++; }},
      //   ], api);
      //   var vnode1 = h('div', [
      //     h('span', 'First sibling'),
      //     h('div', [
      //       h('span', 'Child 1'),
      //       h('span', ['Text 1', 'Text 2']),
      //     ]),
      //   ]);
      //   var vnode2 = h('div');
      //   patch(vnode0, vnode1);
      //   patch(vnode1, vnode2);
      //   expect(created).toEqual(4);
      //   expect(destroyed).toEqual(4);
      // });
    });
  });
  describe('short circuiting', function() {
    it('does not update strictly equal vnodes', function() {
      var result = [];
      function cb(vnode) { result.push(vnode); }
      var vnode1 = h('div', [
        h('span', {hook: {update: cb}}, 'Hello'),
        h('span', 'there'),
      ]);
      patch(vnode0, vnode1);
      patch(vnode1, vnode1);
      expect(result.length).toEqual(0);
    });
    it('does not update strictly equal children', function() {
      var result = [];
      function cb(vnode) { result.push(vnode); }
      var vnode1 = h('div', [
        h('span', (<VNodeData>{hook: {patch: cb}}), 'Hello'),
        h('span', 'there'),
      ]);
      var vnode2 = h('div');
      vnode2.vchildren = vnode1.vchildren;
      patch(vnode0, vnode1);
      patch(vnode1, vnode2);
      expect(result.length).toEqual(0);
    });
  });
});



function toVNode(node: Node, api?: PlatformApi): VNode {
  if (!api) {
    api = PlatformClient(window, document, {}, '/build', domCtrl, nextTick);
  }

  let text: string;
  if (api.isElement(node)) {
    const id = node.id ? '#' + node.id : '';
    const cn = node.getAttribute('class');
    const c = cn ? '.' + cn.split(' ').join('.') : '';
    const sel = api.$tagName(node).toLowerCase() + id + c;
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
      children.push(toVNode(elmChildren[i], api));
    }
    return vnode(sel, {attrs}, children, undefined, node);
  } else if (api.isText(node)) {
    text = api.$getTextContent(node) as string;
    return vnode(undefined, undefined, undefined, text, node);
  } else if (api.isComment(node)) {
    text = api.$getTextContent(node) as string;
    return vnode('!', undefined, undefined, text, undefined);
  } else {
    return vnode('', {}, [], undefined, undefined);
  }
}

