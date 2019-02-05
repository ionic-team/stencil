import * as d from '@declarations';
import { h } from '../h';
import { patch } from '../render';
import { toVNode } from '../to-vnode';


describe('renderer', () => {
  let hostElm: d.HostElement;
  let vnode0: d.VNode;

  const SVGNamespace = 'http://www.w3.org/2000/svg';

  beforeEach(() => {
    hostElm = document.createElement('div');
    vnode0 = {};
    vnode0.elm = hostElm;
  });

  describe('created element', () => {

    it('has tag', () => {
      patch(vnode0, h('div', null));
      expect(hostElm.tagName).toEqual('DIV');
    });

    it('should automatically get svg namespace', () => {
      const svgElm = document.createElementNS(SVGNamespace, 'svg');
      const vnode1 = toVNode(svgElm);
      patch(vnode1, h('svg', null,
        h('foreignObject', null,
          h('div', null, 'I am HTML embedded in SVG')
        )
      ));

      expect(svgElm.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(svgElm.firstChild.firstChild.namespaceURI).not.toEqual(SVGNamespace);
    });

    it('should not affect subsequence element', () => {
      patch(vnode0, h('div', null, [
        h('svg', null, [
          h('title', null, 'Title'),
          h('circle', null)
        ] as any),
        h('div', null)
      ] as any));

      expect(hostElm.tagName).toEqual('DIV');
      expect(hostElm.namespaceURI).not.toEqual(SVGNamespace);
      expect(hostElm.firstElementChild.tagName).toEqual('SVG');
      expect(hostElm.firstElementChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.firstElementChild.firstChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.firstElementChild.lastChild.namespaceURI).toEqual(SVGNamespace);
      expect(hostElm.lastElementChild.namespaceURI).not.toEqual(SVGNamespace);
    });
  });

  describe('created trailing svg element', () => {

    it('should not affect subsequent created element', () => {

      patch(vnode0,  h('div', null,
        h('div', null,
          h('svg', null)
        )
      ));

      const vnode1 = toVNode(vnode0.elm);

      patch(vnode1, h('div', null, [
          h('div', null,
            h('svg', null)
          ),
          h('div', null)
        ] as any
      ));

      const vnode2 = toVNode(vnode1.elm) as any;
      expect(vnode2.vchildren[0].elm.tagName).toEqual('DIV');
      expect(vnode2.vchildren[0].vchildren[0].elm.tagName).toEqual('SVG');
      expect(vnode2.vchildren[1].elm.tagName).toEqual('DIV');
    });
  });

});
