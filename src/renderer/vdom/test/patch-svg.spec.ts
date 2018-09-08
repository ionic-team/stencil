import * as d from '../../../declarations';
import { h } from '../h';
import { mockDocument, mockDomApi, mockRenderer } from '../../../testing/mocks';
import { toVNode } from '../to-vnode';


describe('renderer', () => {
  const patch = mockRenderer();
  const domApi = mockDomApi();
  let doc: Document;
  let hostElm: any;
  let vnode0: d.VNode;

  const SVGNamespace = 'http://www.w3.org/2000/svg';

  beforeEach(() => {
    doc = mockDocument();
    hostElm = doc.createElement('div');
    vnode0 = {};
    vnode0.elm = hostElm;
  });

  describe('created element', () => {

    it('has tag', () => {
      hostElm = patch(hostElm, vnode0, h('div', null)).elm;
      expect(hostElm.tagName).toEqual('DIV');
    });

    it('should automatically get svg namespace', () => {
      const svgElm = doc.createElementNS(SVGNamespace, 'svg');
      const vnode1 = toVNode(domApi, svgElm);
      hostElm = patch(hostElm, vnode1, h('svg', null,
        h('foreignObject', null,
          h('div', null, 'I am HTML embedded in SVG')
        )
      )).elm;

      expect(hostElm.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.firstChild.firstChild.namespaceURI).not.toEqual(SVGNamespace);
    });

    it('should not affect subsequence element', () => {
      hostElm = patch(hostElm, vnode0, h('div', null, [
        h('svg', null, [
          h('title', null, 'Title'),
          h('circle', null)
        ] as any),
        h('div', null)
      ] as any)).elm;

      expect(hostElm.tagName).toEqual('DIV');
      expect(hostElm.namespaceURI).not.toEqual(SVGNamespace);
      expect(hostElm.firstChild.tagName).toEqual('SVG');
      expect(hostElm.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.firstChild.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.firstChild.lastChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.lastChild.namespaceURI).not.toEqual(SVGNamespace);
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
      expect(oneMoreChildAdded.vchildren[1].elm.tagName).toEqual('DIV');
    });
  });

});
