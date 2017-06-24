import { createRenderer } from '../patch';
import { createVNodeFromSsr } from '../slot';
import { h } from '../h';
import { HostContentNodes, VNode } from '../../../util/interfaces';
import { mockPlatform, mockDomApi } from '../../../test';
import { SSR_ID, ELEMENT_NODE, TEXT_NODE, SLOT_TAG } from '../../../util/constants';
import { VNode as VNodeObj } from '../vnode';


describe('ssr', () => {

  describe('ssr vnode', () => {

    it('should create a vnode from nested default slots html', () => {
      elm = domApi.$createElement('ion-test');
      elm.setAttribute('ssrid', '1');
      elm.innerHTML = `
        <child-a ssrid="1">
          <!--s:-->
            <!--s:-->
              <div>88</div>
              <div>mph</div>
            <!--/s-->
          <!--/s-->
        </child-a>
      `;

      ssrVNode = createVNodeFromSsr(domApi, elm, '1');

      expect(ssrVNode.vchildren[1].vchildren.length).toBe(4);
      expect(ssrVNode.vchildren[1].vchildren[1].vtag).toBe(SLOT_TAG);
      expect(ssrVNode.vchildren[1].vchildren[2].vtext).toBeDefined();
      expect(ssrVNode.vchildren[1].vchildren[2].vtext).toBeDefined();

    });

    it('should create a vnode from one named slot html', () => {
      elm = domApi.$createElement('ion-test');
      elm.setAttribute('ssrid', '1');
      elm.innerHTML = `
        <child-a ssrid="1">
          <!--s:named-slot-->
            <div>88</div>
            <div>mph</div>
          <!--/s-->
        </child-a>
      `;

      ssrVNode = createVNodeFromSsr(domApi, elm, '1');

      expect(ssrVNode.vchildren[1].vchildren.length).toBe(3);
      expect(ssrVNode.vchildren[1].vchildren[1].vtag).toBe(SLOT_TAG);
      expect(ssrVNode.vchildren[1].vchildren[1].vattrs.name).toBe('named-slot');
    });

    it('should create a vnode from default slot html', () => {
      elm = domApi.$createElement('ion-test');
      elm.setAttribute('ssrid', '1');
      elm.innerHTML = `
        <child-a ssrid="1">
          <!--s:-->
            <div>88</div>
            <div>mph</div>
          <!--/s-->
        </child-a>
      `;

      ssrVNode = createVNodeFromSsr(domApi, elm, '1');

      expect(ssrVNode.vtag).toBe('ion-test');
      expect(ssrVNode.vchildren.length).toBe(3);
      expect(ssrVNode.vchildren[0].elm.nodeType).toBe(TEXT_NODE);
      expect(ssrVNode.vchildren[1].elm.nodeType).toBe(ELEMENT_NODE);
      expect(ssrVNode.vchildren[1].vtag).toBe('child-a');
      expect(ssrVNode.vchildren[2].elm.nodeType).toBe(TEXT_NODE);

      expect(ssrVNode.vchildren[1].vchildren.length).toBe(3);
      expect(ssrVNode.vchildren[1].vchildren[0].elm.nodeType).toBe(TEXT_NODE);
      expect(ssrVNode.vchildren[1].vchildren[1].vtag).toBe(SLOT_TAG);
      expect(ssrVNode.vchildren[1].vchildren[2].elm.nodeType).toBe(TEXT_NODE);
    });

  });

  describe('render for ssr output', () => {

    beforeEach(() => {
      oldVnode = new VNodeObj();
      elm = domApi.$createElement('ion-test');
      oldVnode.elm = elm;
    });

    it('should add default slot comments', () => {
      newVnode = h('ion-test', 0, [
        h('div', 0, [
          h(SLOT_TAG, 0)
        ])
      ]);

      const defaultContentNode = domApi.$createElement('child-a');
      elm.appendChild(defaultContentNode);

      const hostContentNodes: HostContentNodes = {
        defaultSlot: [
          defaultContentNode
        ]
      };

      ssrVNode = patch(oldVnode, newVnode, false, hostContentNodes, 1);
      elm = <any>ssrVNode.elm;

      expect(elm.getAttribute(SSR_ID)).toBe('1');
      expect(elm.firstElementChild.getAttribute(SSR_ID)).toBe('1');
      expect(elm.firstElementChild.innerHTML).toBe('<!--s:--><child-a></child-a><!--/s-->');
    });

    it('should add same ssrid to all elements', () => {
      newVnode = h('ion-test', 0, [
        h('div', 0, [
          h('button', 0, 'Text')
        ])
      ]);

      ssrVNode = patch(oldVnode, newVnode, false, null, 1);
      elm = <any>ssrVNode.elm;

      expect(elm.getAttribute(SSR_ID)).toBe('1');
      expect(elm.querySelector('div').getAttribute(SSR_ID)).toBe('1');
      expect(elm.querySelector('button').getAttribute(SSR_ID)).toBe('1');
    });

  });


  var domApi = mockDomApi();
  var plt = mockPlatform();
  var patch = createRenderer(<any>plt, domApi);
  var oldVnode: VNode;
  var newVnode: VNode;
  var ssrVNode: VNode;
  var elm: HTMLElement;

});
