import * as d from '../../../declarations';
import { h } from '../h';
import { mockDomApi, mockElement, mockRenderer, mockSVGElement } from '../../../testing/mocks';
import { toVNode } from '../to-vnode';


describe('renderer', () => {
  const patch = mockRenderer();
  const domApi = mockDomApi();

  let hostElm: any;
  let vnode0: d.VNode;

  beforeEach(() => {
    hostElm = mockElement('div');
    vnode0 = {};
    vnode0.elm = hostElm;
  });

  describe('created element', () => {

    it('has tag', () => {
      hostElm = patch(hostElm, vnode0, h('div', null)).elm;
      expect(hostElm.tagName).toEqual('DIV');
    });

    it('should automatically get svg namespace', () => {
      const SVGNamespace = 'http://www.w3.org/2000/svg';
      const XHTMLNamespace = 'http://www.w3.org/1999/xhtml';

      const svgElm = mockSVGElement();
      const vnode1 = toVNode(domApi, svgElm);
      hostElm = patch(hostElm, vnode1, h('svg', null,
        h('foreignObject', null,
          h('div', null, 'I am HTML embedded in SVG')
        )
      )).elm;

      expect(hostElm.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.firstChild.firstChild.namespaceURI).toEqual(XHTMLNamespace);
    });

    it('should not affect subsequence element', () => {
      hostElm = patch(hostElm, vnode0, h('div', null, [
        h('svg', null, [
          h('title', null, 'Title'),
          h('circle', null)
        ] as any),
        h('div', null)
      ] as any)).elm;

      expect(hostElm.constructor.name).toEqual('HTMLDivElement');
      expect(hostElm.firstChild.constructor.name).toEqual('SVGSVGElement');
      expect(hostElm.firstChild.firstChild.constructor.name).toEqual('SVGElement');
      expect(hostElm.firstChild.lastChild.constructor.name).toEqual('SVGElement');
      expect(hostElm.lastChild.constructor.name).toEqual('HTMLDivElement');
    });
  });

  describe('created trailing svg element', () => {

    it('should not affect subsequent created element', () => {

      const divWithSVGChild = patch(hostElm, vnode0,  h('div', null,
        h('div', null,
          h('svg', null)
        )
      ));
      const oneMoreChildAdded = patch(hostElm, divWithSVGChild, h('div', null, [
          h('div', null,
            h('svg', null)
          ),
          h('div', null)
        ] as any
      ));
      expect(oneMoreChildAdded.vchildren[1].elm.constructor.name).toEqual('HTMLDivElement');
    });
  });

});
