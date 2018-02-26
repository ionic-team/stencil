import { mockDomApi, mockElement, mockRenderer, mockTextNode } from '../../../testing/mocks';
import { SVG_NS } from '../../../util/constants';
import { toVNode } from '../to-vnode';
import { VNode, h } from '../h';
const shuffle = require('knuth-shuffle').knuthShuffle;


function prop(name: any) {
  return function(obj: any) {
    return obj[name];
  };
}

function map(fn: any, list: any) {
  const ret = [];
  for (let i = 0; i < list.length; ++i) {
    ret[i] = fn(list[i]);
  }
  return ret;
}

const inner = prop('innerHTML');

describe('renderer', () => {
  const domApi = mockDomApi();
  const patch = mockRenderer(null, domApi);

  let elm: any;
  let vnode0: any;

  beforeEach(() => {
    elm = mockElement('div');
    vnode0 = new VNode();
    vnode0.elm = elm;
  });

  describe('shadow dom', () => {
    const supportsShadowDom = true;
    const patch = mockRenderer(null, domApi);

    it('does not attachShadow on update render', () => {
      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      let shadowOpts: any;
      elm.attachShadow = (opts: any) => {
        shadowOpts = opts;
      };
      elm = patch(vnode0, h('my-tag', null), true, null, null, 'shadow').elm;
      expect(shadowOpts).toBeUndefined();
    });

    it('attachShadow on first render', () => {
      const domApi = mockDomApi();
      domApi.$supportsShadowDom = true;
      const patch = mockRenderer(null, domApi);

      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      let shadowOpts: any;
      elm.attachShadow = (opts: any) => {
        shadowOpts = opts;
        elm.shadowRoot = mockElement('shadowRoot');
        return elm;
      };
      elm = patch(vnode0, h('my-tag', null), false, null, null, 'shadow').elm;
      expect(elm.shadowRoot).toBeDefined();
      expect(shadowOpts).toBeDefined();
      expect(shadowOpts.mode).toBe('open');
    });

  });

  describe('functional component', () => {

    it('should render a basic component', () => {
      function functionalComp({children, ...props}: any) {
        return h('span', props, children);
      }

      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      elm = patch(vnode0,
        h('my-tag', null,
          h(functionalComp, { class: 'functional-cmp' })
        )
      ).elm;
      expect(elm.childNodes[0].tagName).toBe('SPAN');
      expect(elm.childNodes[0].textContent).toBe('');
      expect(elm.childNodes[0].className).toBe('functional-cmp');
    });

    it('should render as a sibling component', () => {
      function functionalComp({children, ...props}: any) {
        return h('span', props, children);
      }

      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      elm = patch(vnode0,
        h('my-tag', null,
          h('span', null, 'Test Child'),
          h(functionalComp, { class: 'functional-cmp' })
        )
      ).elm;
      expect(elm.childNodes[0].tagName).toBe('SPAN');
      expect(elm.childNodes[0].textContent).toBe('Test Child');
      expect(elm.childNodes[1].tagName).toBe('SPAN');
      expect(elm.childNodes[1].textContent).toBe('');
      expect(elm.childNodes[1].className).toBe('functional-cmp');
    });
    it('should render children', () => {
      function functionalComp({children, ...props}: any) {
        return h('span', props, children);
      }

      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      elm = patch(vnode0,
        h('my-tag', null,
          h(functionalComp, { class: 'functional-cmp' },
            h('span', null, 'Test Child'),
          )
        )
      ).elm;
      expect(elm.childNodes[0].tagName).toBe('SPAN');
      expect(elm.childNodes[0].className).toBe('functional-cmp');
      expect(elm.childNodes[0].textContent).toBe('Test Child');
    });
  });

  describe('scoped css', () => {

    it('adds host scope id to shadow dom encapsulation root element, but doesnt support SD', () => {
      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      elm.attachShadow = () => {
        return elm;
      };
      elm = patch(vnode0, h('my-tag', null), false, null, null, 'shadow').elm;
      expect(elm.hasAttribute('data-my-tag-host')).toBe(true);
    });

    it('adds scope id to child elements', () => {
      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      elm = patch(vnode0, h('my-tag', null, h('div', null)), false, null, null, 'scoped').elm;
      expect(elm.firstChild.hasAttribute('data-my-tag')).toBe(true);
    });

    it('adds host scope id to scoped css encapsulation root element', () => {
      elm = mockElement('my-tag');
      vnode0 = new VNode();
      vnode0.elm = elm;
      elm = patch(vnode0, h('my-tag', null), false, null, null, 'scoped').elm;
      expect(elm.hasAttribute('data-my-tag-host')).toBe(true);
    });

  });

  describe('created element', () => {

    it('has tag', () => {
      elm = patch(vnode0, h('div', null)).elm;
      expect(elm.tagName).toEqual('DIV');
    });

    it('receives css classes', () => {
      const vnode1 = h('div', null, h('i', { class: { i: true, am: true, a: true, 'class': true } }));
      elm = patch(vnode0, vnode1).elm;

      expect(elm.firstChild).toMatchClasses(['i', 'am', 'a', 'class']);
    });

    it('should not remove duplicate css classes', () => {
      const vnode1 = h('div', { class: 'middle aligned center aligned' }, 'Hello');
      elm = patch(vnode0, vnode1).elm;
      expect(elm.className).toEqual('middle aligned center aligned');
    });

    it('can create elements with text content', () => {
      elm = patch(vnode0, h('div', null, 'I am a string')).elm;
      expect(elm.innerHTML).toEqual('I am a string');
    });
  });

  describe('patching an element', () => {

    it('does not remove classes of previous from dom if vdom does not document them', () => {
      elm.classList.add('horse');
      const vnode1 = h('i', { class: {i: true, am: true } });
      elm = patch(vnode0, vnode1).elm;

      expect(elm).toMatchClasses(['i', 'am', 'horse']);
    });

    it('changes elements classes from previous vnode', () => {
      const vnode1 = h('i', { class: { i: true, am: true, horse: true } });
      const vnode2 = h('i', { class: { i: true, am: true, horse: false } });
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;

      expect(elm).toMatchClasses(['i', 'am']);
    });

    it('preserves memoized classes', () => {
      const cachedClass = { i: true, am: true, horse: false };
      const vnode1 = h('i', { class: cachedClass });
      const vnode2 = h('i', { class: cachedClass });
      elm = patch(vnode0, vnode1).elm;
      expect(elm).toMatchClasses(['i', 'am']);

      elm = patch(vnode1, vnode2).elm;
      expect(elm).toMatchClasses(['i', 'am']);
    });

    it('removes missing classes', () => {
      const vnode1 = h('i', { class: {i: true, am: true, horse: true } });
      const vnode2 = h('i', { class: {i: true, am: true } });
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      expect(elm).toMatchClasses(['i', 'am']);
    });

    it('removes classes when class set to empty string', () => {
      const vnode1 = h('i', { class: {i: true, am: true, horse: true } });
      const vnode2 = h('i', { class: '' });
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      expect(elm).toMatchClasses([]);
    });


    describe('using toVNode()', () => {

      it('can remove previous children of the root element', () => {
        const h2 = mockElement('h2');
        h2.textContent = 'Hello';

        const prevElm = mockElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        prevElm.appendChild(h2);

        const nextVNode = h('div', null, h('span', null, 'Hi'));
        elm = patch(toVNode(domApi, prevElm), nextVNode).elm;

        expect(elm).toEqual(prevElm);
        expect(elm.tagName).toEqual('DIV');
        expect(elm.id).toEqual('id');
        expect(elm.className).toEqual('class');
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].tagName).toEqual('SPAN');
        expect(elm.childNodes[0].textContent).toEqual('Hi');
      });

      it('can remove previous children of the root element with update', () => {
        const h2 = mockElement('h2');
        h2.textContent = 'Hello';

        const prevElm = mockElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        prevElm.appendChild(h2);

        const nextVNode = h('div', null, h('span', null, 'Hi'));
        elm = patch(toVNode(domApi, prevElm), nextVNode, true).elm;

        expect(elm).toEqual(prevElm);
        expect(elm.tagName).toEqual('DIV');
        expect(elm.id).toEqual('id');
        expect(elm.className).toEqual('class');
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].tagName).toEqual('SPAN');
        expect(elm.childNodes[0].textContent).toEqual('Hi');
      });

      it('can remove some children of the root element', () => {
        const h2 = mockElement('h2');
        h2.textContent = 'Hello';

        const prevElm = mockElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';

        const text = mockTextNode('Foobar');
        (<any>text).testProperty = function () {/**/}; // ensures we dont recreate the Text Node
        prevElm.appendChild(text);
        prevElm.appendChild(h2);

        const nextVNode = h('div', null, 'Foobar');
        elm = patch(toVNode(domApi, prevElm), nextVNode).elm;

        expect(elm).toEqual(prevElm);
        expect(elm.tagName).toEqual('DIV');
        expect(elm.id).toEqual('id');
        expect(elm.className).toEqual('class');
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].nodeType).toEqual(3);
        expect(elm.childNodes[0].wholeText).toEqual('Foobar');
        expect(typeof elm.childNodes[0].testProperty).toEqual('function');
      });

      it('can remove text elements', () => {
        const h2 = mockElement('h2');
        h2.textContent = 'Hello';

        const prevElm = mockElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';

        const text = mockTextNode('Foobar');
        prevElm.appendChild(text);
        prevElm.appendChild(h2);

        const nextVNode = h('div', null, h('h2', null, 'Hello'));
        elm = patch(toVNode(domApi, prevElm), nextVNode).elm;

        expect(elm).toEqual(prevElm);
        expect(elm.tagName).toEqual('DIV');
        expect(elm.id).toEqual('id');
        expect(elm.className).toEqual('class');
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].nodeType).toEqual(1);
        expect(elm.childNodes[0].textContent).toEqual('Hello');
      });

    });

    describe('updating children with keys', () => {
      function spanNum(n: any) {
        if (n == null) {
          return n;
        } else if (typeof n === 'string') {
          return h('span', null, n);
        } else {
          return h('span', { key: n }, n.toString());
        }
      }

      function vnodeMap(arr: number[]) {
        return h.apply(null, ['span', null, ...arr.map(spanNum)]);
      }

      describe('addition of elements', () => {

        it('appends elements', () => {
          const vnode1 = vnodeMap([1]);
          const vnode2 = vnodeMap([1, 2, 3]);

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(1);

          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);
          expect(elm.children[1].innerHTML).toEqual('2');
          expect(elm.children[2].innerHTML).toEqual('3');
        });

        it('prepends elements', () => {
          const vnode1 = vnodeMap([4, 5]);
          const vnode2 = vnodeMap([1, 2, 3, 4, 5]);

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(2);

          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3', '4', '5']);
        });

        it('add elements in the middle', () => {
          const vnode1 = vnodeMap([1, 2, 4, 5]);
          const vnode2 = vnodeMap([1, 2, 3, 4, 5]);

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(4);
          expect(elm.children.length).toEqual(4);

          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3', '4', '5']);
        });

        it('add elements at begin and end', () => {
          const vnode1 = vnodeMap([2, 3, 4]);
          const vnode2 = vnodeMap([1, 2, 3, 4, 5]);

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);

          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3', '4', '5']);
        });

        it('adds children to parent with no children', () => {
          const vnode1 = h('span', {k: 'span'});
          const vnode2 = h('span', {k: 'span'}, ...[1, 2, 3].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(0);

          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
        });

        it('removes all children from parent', () => {
          const vnode1 = h('span', {k: 'span'}, ...[1, 2, 3].map(spanNum));
          const vnode2 = h('span', {k: 'span'});
          elm = patch(vnode0, vnode1).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(0);
        });

        it('update one child with same key but different sel', () => {
          const vnode1 = h('span', {k: 'spans'}, ...[1, 2, 3].map(spanNum));
          const vnode2 = h('span', {k: 'span'}, ...[spanNum(1), h('i', {k: 2}, '2'), spanNum(3)]);
          elm = patch(vnode0, vnode1).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['1', '2', '3']);
          expect(elm.children.length).toEqual(3);
          expect(elm.children[1].tagName).toEqual('I');
        });

      });

      describe('removal of elements', () => {

        it('removes elements from the beginning', () => {
          const vnode1 = h('span', null, ...[1, 2, 3, 4, 5].map(spanNum));
          const vnode2 = h('span', null, ...[3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(5);
          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['3', '4', '5']);
        });

        it('removes elements from the end', () => {
          const vnode1 = h('span', null, ...[1, 2, 3, 4, 5].map(spanNum));
          const vnode2 = h('span', null, ...[1, 2, 3].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(5);

          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);

          expect(elm.children[0].innerHTML).toEqual('1');
          expect(elm.children[1].innerHTML).toEqual('2');
          expect(elm.children[2].innerHTML).toEqual('3');
        });

        it('removes elements from the middle', () => {
          const vnode1 = h('span', null, ...[1, 2, 3, 4, 5].map(spanNum));
          const vnode2 = h('span', null, ...[1, 2, 4, 5].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(5);

          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(4);

          expect(elm.children[0].innerHTML).toEqual('1');
          expect(elm.children[1].innerHTML).toEqual('2');
          expect(elm.children[2].innerHTML).toEqual('4');
          expect(elm.children[3].innerHTML).toEqual('5');
        });

        it('removes child svg elements', () => {
          vnode0.elm = mockElement('svg');

          const a = h('svg', {n: SVG_NS}, h('g', null), h('g', null));
          const b = h('svg', {n: SVG_NS}, h('g', null));

          const resultA = patch(vnode0, a);
          expect(resultA.elm.childNodes.length).toEqual(2);

          const resultB = patch(resultA, b);
          expect(resultB.elm.childNodes.length).toEqual(1);
        });

      });

      describe('element reordering', () => {

        it('moves element forward', () => {
          const vnode1 = h('span', null, ...[1, 2, 3, 4].map(spanNum));
          const vnode2 = h('span', null, ...[2, 3, 1, 4].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(4);

          (<any>elm.children[0]).instance = 1;
          (<any>elm.children[1]).instance = 2;
          (<any>elm.children[2]).instance = 3;
          (<any>elm.children[3]).instance = 4;

          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(4);

          expect(elm.children[0].innerHTML).toEqual('2');
          expect(elm.children[0].instance).toEqual(2);

          expect(elm.children[1].innerHTML).toEqual('3');
          expect(elm.children[1].instance).toEqual(3);

          expect(elm.children[2].innerHTML).toEqual('1');
          expect(elm.children[2].instance).toEqual(1);

          expect(elm.children[3].innerHTML).toEqual('4');
          expect(elm.children[3].instance).toEqual(4);
        });

        it('moves element to end', () => {
          const vnode1 = h('span', null, ...[1, 2, 3].map(spanNum));
          const vnode2 = h('span', null, ...[2, 3, 1].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);

          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);
          expect(elm.children[0].innerHTML).toEqual('2');
          expect(elm.children[1].innerHTML).toEqual('3');
          expect(elm.children[2].innerHTML).toEqual('1');
        });

        it('moves element backwards', () => {
          const vnode1 = h('span', null, ...[1, 2, 3, 4].map(spanNum));
          const vnode2 = h('span', null, ...[1, 4, 2, 3].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(4);

          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(4);
          expect(elm.children[0].innerHTML).toEqual('1');
          expect(elm.children[1].innerHTML).toEqual('4');
          expect(elm.children[2].innerHTML).toEqual('2');
          expect(elm.children[3].innerHTML).toEqual('3');
        });

        it('swaps first and last', () => {
          const vnode1 = h('span', null, ...[1, 2, 3, 4].map(spanNum));
          const vnode2 = h('span', null, ...[4, 2, 3, 1].map(spanNum));

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

      describe('combinations of additions, removals and reorderings', () => {

        it('move to left and replace', () => {
          const vnode1 = h('span', null, ...[1, 2, 3, 4, 5].map(spanNum));
          const vnode2 = h('span', null, ...[4, 1, 2, 3, 6].map(spanNum));

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

        it('moves to left and leaves hole', () => {
          const vnode1 = h('span', null, ...[1, 4, 5].map(spanNum));
          const vnode2 = h('span', null, ...[4, 6].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);

          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(['4', '6']);
        });

        it('handles moved and set to undefined element ending at the end', () => {
          const vnode1 = h('span', null, ...[2, 4, 5].map(spanNum));
          const vnode2 = h('span', null, ...[4, 5, 3].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.children.length).toEqual(3);

          elm = patch(vnode1, vnode2).elm;
          expect(elm.children.length).toEqual(3);
          expect(elm.children[0].innerHTML).toEqual('4');
          expect(elm.children[1].innerHTML).toEqual('5');
          expect(elm.children[2].innerHTML).toEqual('3');
        });

        it('moves a key in non-keyed nodes with a size up', () => {
          const vnode1 = h('span', null, ...[1, 'a', 'b', 'c'].map(spanNum));
          const vnode2 = h('span', null, ...['d', 'a', 'b', 'c', 1, 'e'].map(spanNum));

          elm = patch(vnode0, vnode1).elm;
          expect(elm.childNodes.length).toEqual(4);
          expect(elm.textContent).toEqual('1abc');

          elm = patch(vnode1, vnode2).elm;
          expect(elm.childNodes.length).toEqual(6);
          expect(elm.textContent).toEqual('dabc1e');
        });

      });

      it('reverses elements', () => {
        const vnode1 = h('span', null, ...[1, 2, 3, 4, 5, 6, 7, 8].map(spanNum));
        const vnode2 = h('span', null, ...[8, 7, 6, 5, 4, 3, 2, 1].map(spanNum));

        elm = patch(vnode0, vnode1).elm;
        expect(elm.children.length).toEqual(8);

        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['8', '7', '6', '5', '4', '3', '2', '1']);
      });

      it('something', () => {
        const vnode1 = h('span', null, ...[0, 1, 2, 3, 4, 5].map(spanNum));
        const vnode2 = h('span', null, ...[4, 3, 2, 1, 5, 0].map(spanNum));

        elm = patch(vnode0, vnode1).elm;
        expect(elm.children.length).toEqual(6);

        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['4', '3', '2', '1', '5', '0']);
      });

      it('handles random shuffles', () => {
        let n: number, i: number;
        const arr = [], opacities: any[] = [], elms = 14, samples = 5;

        function spanNumWithOpacity(n: any, o: any) {
          return h('span', {k: n, s: {opacity: o}}, n.toString());
        }

        for (n = 0; n < elms; ++n) {
          arr[n] = n;
        }

        for (n = 0; n < samples; ++n) {
          const vnode1 = h('span', null, ...arr.map(function(n) {
            return spanNumWithOpacity(n, '1');
          }));

          const shufArr = shuffle(arr.slice(0));
          let elm: any = mockElement('div');
          vnode0.elm = elm;
          elm = patch(vnode0, vnode1).elm;

          for (i = 0; i < elms; ++i) {
            expect(elm.children[i].innerHTML).toEqual(i.toString());
            opacities[i] = Math.random().toFixed(5).toString();
          }

          const vnode2 = h('span', null, ...arr.map(function(n) {
            return spanNumWithOpacity(shufArr[n], opacities[n]);
          }));

          elm = patch(vnode1, vnode2).elm;
          for (i = 0; i < elms; ++i) {
            expect(elm.children[i].innerHTML).toEqual(shufArr[i].toString());
            expect(opacities[i].indexOf(elm.children[i].style.opacity)).toEqual(0);
          }
        }
      });

      it('supports null/undefined children', () => {
        const vnode1 = h('i', null, ...[0, 1, 2, 3, 4, 5].map(spanNum));
        const vnode2 = h('i', null, ...[null, 2, undefined, null, 1, 0, null, 5, 4, null, 3, undefined].map(spanNum));

        elm = patch(vnode0, vnode1).elm;
        expect(elm.children.length).toEqual(6);

        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['2', '1', '0', '5', '4', '3']);
      });

      it('supports all null/undefined children', () => {
        const vnode1 = h('i', null, ...[0, 1, 2, 3, 4, 5].map(spanNum));
        const vnode2 = h('i', null, ...[null, null, undefined, null, null, undefined]);
        const vnode3 = h('i', null, ...[5, 4, 3, 2, 1, 0].map(spanNum));

        patch(vnode0, vnode1);

        elm = patch(vnode1, vnode2).elm;
        expect(elm.children.length).toEqual(0);

        elm = patch(vnode2, vnode3).elm;
        expect(map(inner, elm.children)).toEqual(['5', '4', '3', '2', '1', '0']);
      });

      it('handles random shuffles with null/undefined children', () => {
        let i, j, r, len, arr;
        const maxArrLen = 15, samples = 5;
        let vnode1 = vnode0, vnode2;

        for (i = 0; i < samples; ++i, vnode1 = vnode2) {
          len = Math.floor(Math.random() * maxArrLen);
          arr = [];

          for (j = 0; j < len; ++j) {
            if ((r = Math.random()) < 0.5) arr[j] = String(j);
            else if (r < 0.75) arr[j] = null;
            else arr[j] = undefined;
          }

          shuffle(arr);
          vnode2 = h('div', null, ...arr.map(spanNum));

          elm = patch(vnode1, vnode2).elm;
          expect(map(inner, elm.children)).toEqual(arr.filter(function(x) {return x != null; }));
        }
      });
    });

    describe('updating children without keys', () => {

      it('appends elements', () => {
        const vnode1 = h('div', null, h('span', null, 'Hello'));
        const vnode2 = h('div', null, h('span', null, 'Hello'), h('span', null, 'World'));

        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['Hello']);

        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['Hello', 'World']);
      });

      it('handles unmoved text nodes', () => {
        const vnode1 = h('div', null, ...[
          'Text',
          h('span', null, 'Span')
        ]);
        const vnode2 = h('div', null, ...['Text', h('span', null, 'Span')]);

        elm = patch(vnode0, vnode1).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');

        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');
      });

      it('handles changing text children', () => {
        const vnode1 = h('div', null, ...['Text', h('span', null, 'Span')]);
        const vnode2 = h('div', null, ...['Text2', h('span', null, 'Span')]);

        elm = patch(vnode0, vnode1).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text');

        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes[0].textContent).toEqual('Text2');
      });

      it('prepends element', () => {
        const vnode1 = h('div', null, ...[h('span', null, 'World')]);
        const vnode2 = h('div', null, ...[h('span', null, 'Hello'), h('span', null, 'World')]);

        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['World']);

        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['Hello', 'World']);
      });

      it('prepends element of different tag type', () => {
        const vnode1 = h('div', null, ...[h('span', null, 'World')]);
        const vnode2 = h('div', null, ...[h('div', null, 'Hello'), h('span', null, 'World')]);

        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['World']);

        elm = patch(vnode1, vnode2).elm;
        expect(map(prop('tagName'), elm.children)).toEqual(['DIV', 'SPAN']);
        expect(map(inner, elm.children)).toEqual(['Hello', 'World']);
      });

      it('removes elements', () => {
        const vnode1 = h('div', null, ...[h('span', null, 'One'), h('span', null, 'Two'), h('span', null, 'Three')]);
        const vnode2 = h('div', null, ...[h('span', null, 'One'), h('span', null, 'Three')]);

        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['One', 'Two', 'Three']);

        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['One', 'Three']);
      });

      it('removes a single text node', () => {
        const vnode1 = h('div', null, 'One');
        const vnode2 = h('div', null);

        elm = patch(vnode0, vnode1).elm;
        expect(elm.textContent).toEqual('One');

        patch(vnode1, vnode2);
        expect(elm.textContent).toEqual('');
      });

      it('removes a single text node when children are updated', () => {
        const vnode1 = h('div', null, 'One');
        const vnode2 = h('div', null, ...[ h('div', null, 'Two'), h('span', null, 'Three') ]);

        elm = patch(vnode0, vnode1).elm;
        expect(elm.textContent).toEqual('One');

        patch(vnode1, vnode2);
        expect(map(prop('textContent'), elm.childNodes)).toEqual(['Two', 'Three']);
      });

      it('should replace elements created with Array().map with text', () => {
        const a = Array.from(Array(2)).map(() => h('div', null, 'a'));

        const vnode1 = h('span', null, ...a);
        const vnode2 = h('span', null, 'just text');

        elm = patch(vnode0, vnode1).elm;

        expect(elm.childNodes.length).toEqual(2);
        expect(elm.textContent).toEqual('aa');

        elm = patch(vnode1, vnode2).elm;
        expect(elm.childNodes.length).toEqual(1);
        expect(elm.textContent).toEqual('just text');
      });

      it('removes a text node among other elements', () => {
        const vnode1 = h('div', null, ...[ 'One', h('span', null, 'Two') ]);
        const vnode2 = h('div', null, ...[ h('div', null, 'Three')]);

        elm = patch(vnode0, vnode1).elm;
        expect(map(prop('textContent'), elm.childNodes)).toEqual(['One', 'Two']);

        patch(vnode1, vnode2);

        expect(elm.childNodes.length).toEqual(1);
        expect(elm.childNodes[0].tagName).toEqual('DIV');
        expect(elm.childNodes[0].textContent).toEqual('Three');
      });

      it('reorders elements', () => {
        const vnode1 = h('div', null, ...[h('span', null, 'One'), h('div', null, 'Two'), h('b', null, 'Three')]);
        const vnode2 = h('div', null, ...[h('b', null, 'Three'), h('span', null, 'One'), h('div', null, 'Two')]);

        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['One', 'Two', 'Three']);

        elm = patch(vnode1, vnode2).elm;
        expect(map(prop('tagName'), elm.children)).toEqual(['B', 'SPAN', 'DIV']);
        expect(map(inner, elm.children)).toEqual(['Three', 'One', 'Two']);
      });

      it('supports null/undefined children', () => {
        const vnode1 = h('i', null, ...[null, h('i', null, '1'), h('i', null, '2'), null]);
        const vnode2 = h('i', null, ...[h('i', null, '2'), undefined, undefined, h('i', null, '1'), undefined]);
        const vnode3 = h('i', null, ...[null, h('i', null, '1'), undefined, null, h('i', null, '2'), undefined, null]);

        elm = patch(vnode0, vnode1).elm;
        expect(map(inner, elm.children)).toEqual(['1', '2']);

        elm = patch(vnode1, vnode2).elm;
        expect(map(inner, elm.children)).toEqual(['2', '1']);

        elm = patch(vnode2, vnode3).elm;
        expect(map(inner, elm.children)).toEqual(['1', '2']);
      });

      it('supports all null/undefined children', () => {
        const vnode1 = h('i', null, ...[h('i', null, '1'), h('i', null, '2')]);
        const vnode2 = h('i', null, ...[null, null, undefined]);
        const vnode3 = h('i', null, ...[h('i', null, '2'), h('i', null, '1')]);

        patch(vnode0, vnode1);

        elm = patch(vnode1, vnode2).elm;
        expect(elm.children.length).toEqual(0);

        elm = patch(vnode2, vnode3).elm;
        expect(map(inner, elm.children)).toEqual(['2', '1']);
      });

    });

  });

});
