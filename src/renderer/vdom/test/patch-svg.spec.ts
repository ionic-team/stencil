import { mockDomApi, mockElement, mockRenderer, mockSVGElement } from '../../../testing/mocks';
import { toVNode } from '../to-vnode';
import { VNode, h } from '../h';


describe('renderer', () => {
  const patch = mockRenderer();
  const domApi = mockDomApi();

  var elm: any;
  var vnode0: any;

  beforeEach(function() {
    elm = mockElement('div');
    vnode0 = new VNode();
    vnode0.elm = elm;
  });

  describe('created element', () => {

    it('has tag', () => {
      elm = patch(vnode0, h('div', null)).elm;
      expect(elm.tagName).toEqual('DIV');
    });

    it('should automatically get svg namespace', function() {
      const SVGNamespace = 'http://www.w3.org/2000/svg';
      const XHTMLNamespace = 'http://www.w3.org/1999/xhtml';

      const svgElm = mockSVGElement();
      const vnode1 = toVNode(domApi, svgElm);
      elm = patch(vnode1, h('svg', null,
        h('foreignObject', null,
          h('div', null, 'I am HTML embedded in SVG')
        )
      )).elm;

      expect(elm.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(elm.firstChild.firstChild.namespaceURI).toEqual(XHTMLNamespace);
    });

    it('should not affect subsequence element', function() {
      elm = patch(vnode0, h('div', null, [
        h('svg', null, [
          h('title', null, 'Title'),
          h('circle', null)
        ]),
        h('div', null)
      ])).elm;

      expect(elm.constructor.name).toEqual('HTMLDivElement');
      expect(elm.firstChild.constructor.name).toEqual('SVGSVGElement');
      expect(elm.firstChild.firstChild.constructor.name).toEqual('SVGElement');
      expect(elm.firstChild.lastChild.constructor.name).toEqual('SVGElement');
      expect(elm.lastChild.constructor.name).toEqual('HTMLDivElement');
    });
  });

  describe('created trailing svg element', () => {

    it('should not affect subsequent created element', function() {

      const divWithSVGChild = patch(vnode0,  h('div', null,
        h('div', null,
          h('svg', null)
        )
      ));
      const oneMoreChildAdded = patch(divWithSVGChild, h('div', null, [
          h('div', null,
            h('svg', null)
          ),
          h('div', null)
        ]
      ));
      expect(oneMoreChildAdded.vchildren[1].elm.constructor.name).toEqual('HTMLDivElement');
    });
  })
});
