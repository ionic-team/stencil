import { createRendererPatch } from '../patch';
import { createVNodesFromSsr } from '../slot';
import { h } from '../h';
import { HostContentNodes, VNode } from '../../../util/interfaces';
import { mockPlatform, mockDomApi, removeWhitespaceFromNodes } from '../../../testing/mocks';
import { SSR_VNODE_ID, SSR_CHILD_ID, SLOT_TAG } from '../../../util/constants';
import { VNode as VNodeObj } from '../vnode';


describe('ssr', () => {

  describe('ssr vnode', () => {

    it('should get text from deep nested default slot', () => {
      const rootElm = domApi.$createElement('div');
      rootElm.innerHTML = `
        <cmp-a data-ssrv="1">
          <cmp-b data-ssrc="1.0" data-ssrv="4">
            <cmp-c data-ssrc="4.0">
              <cmp-d data-ssrc="4.0.">
                <!--s.1.0-->News<!--/-->
              </cmp-d>
            </cmp-c>
          </cmp-b>
        </cmp-a>
      `;
      removeWhitespaceFromNodes(rootElm);

      createVNodesFromSsr(domApi, rootElm);

      const cmpA: VNode = (<any>rootElm).querySelector('cmp-a')._vnode;
      expect(cmpA.vchildren.length).toBe(1);
      expect(cmpA.vchildren[0].vtag).toBe('cmp-b');
      expect(cmpA.vchildren[0].vchildren.length).toBe(1);
    });

    it('should create a vnode from complex html', () => {
      const rootElm = domApi.$createElement('div');
      rootElm.innerHTML = `
        <cmp-a data-ssrv="1">
          <cmp-b data-ssrc="1.0" data-ssrv="2">
            <!--s.2.0-->TEXT 1<!--/-->
            <cmp-c data-ssrc="2.1." data-ssrv="4">
              <!--s.1.0-->TEXT 2<!--/-->
              <!--s.1.1-->TEXT 3<!--/-->
              <!--s.4.0-->TEXT 7<!--/-->
              <cmp-d data-ssrc="1.2." data-ssrv="3">
                <cmp-f data-ssrc="3.0.">
                  <!--s.3.0-->TEXT 6<!--/-->
                </cmp-f>
              </cmp-d>
              <cmp-e data-ssrc="1.3." data-ssrv="5">
                <!--s.1.0-->TEXT 5<!--/-->
              </cmp-e>
              <!--s.1.4-->TEXT 4<!--/-->
            </cmp-c>
          </cmp-b>
        </cmp-a>
      `;
      removeWhitespaceFromNodes(rootElm);

      createVNodesFromSsr(domApi, rootElm);

      const cmpA: VNode = (<any>rootElm).querySelector('cmp-a')._vnode;
      expect(cmpA.vchildren.length).toBe(1);
      expect(cmpA.vchildren[0].vtag).toBe('cmp-b');
      expect(cmpA.vchildren[0].vchildren[0].vtext).toBe('TEXT 2');
      expect(cmpA.vchildren[0].vchildren[1].vtext).toBe('TEXT 3');
      expect(cmpA.vchildren[0].vchildren[2].vtag).toBe('cmp-d');
      expect(cmpA.vchildren[0].vchildren[3].vtag).toBe('cmp-e');
      expect(cmpA.vchildren[0].vchildren[3].vchildren.length).toBe(1);
      expect(cmpA.vchildren[0].vchildren[3].vchildren[0].vtext).toBe('TEXT 5');
      expect(cmpA.vchildren[0].vchildren[4].vtext).toBe('TEXT 4');
      expect(cmpA.vchildren[0].vchildren.length).toBe(5);

      const cmpB: VNode = (<any>rootElm).querySelector('cmp-b')._vnode;
      expect(cmpB.vchildren.length).toBe(2);
      expect(cmpB.vchildren[0].vtext).toBe('TEXT 1');
      expect(cmpB.vchildren[1].vtag).toBe('cmp-c');

      const cmpC: VNode = (<any>rootElm).querySelector('cmp-c')._vnode;
      expect(cmpC.vchildren.length).toBe(1);
      expect(cmpC.vchildren[0].vtext).toBe('TEXT 7');

      const cmpD: VNode = (<any>rootElm).querySelector('cmp-d')._vnode;
      expect(cmpD.vchildren.length).toBe(1);
      expect(cmpD.vchildren[0].vtag).toBe('cmp-f');
      expect(cmpD.vchildren[0].vchildren[0].vtext).toBe('TEXT 6');

      const cmpE: VNode = (<any>rootElm).querySelector('cmp-e')._vnode;
      expect(cmpE.vchildren).toBeUndefined();
    });

    it('should create a vnode from nested default slots html', () => {
      const rootElm = domApi.$createElement('div');
      rootElm.innerHTML = `
        <cmp-a data-ssrv="0">
          <cmp-b data-ssrv="1" data-ssrc="0.0">
            <!--s.1.0-->
            88
          </cmp-b>
          <cmp-c data-ssrv="2" data-ssrc="0.1">
            <!--s.2.0-->
            mph
          </cmp-c>
        </cmp-a>
      `;
      removeWhitespaceFromNodes(rootElm);

      createVNodesFromSsr(domApi, rootElm);

      const cmpA: VNode = (<any>rootElm).querySelector('cmp-a')._vnode;
      expect(cmpA.vchildren.length).toBe(2);
      expect(cmpA.vchildren[0].vtag).toBe('cmp-b');
      expect(cmpA.vchildren[1].vtag).toBe('cmp-c');

      const cmpB: VNode = (<any>rootElm).querySelector('cmp-b')._vnode;
      expect(cmpB.vchildren.length).toBe(1);
      expect(cmpB.vchildren[0].vtext).toBe('88');

      const cmpC: VNode = (<any>rootElm).querySelector('cmp-c')._vnode;
      expect(cmpC.vchildren.length).toBe(1);
      expect(cmpC.vchildren[0].vtext).toBe('mph');
    });

  });

  describe('render for ssr output', () => {
    var oldVnode: VNode;
    var newVnode: VNode;
    var ssrVNode: VNode;
    var elm: Element;

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
      elm = removeWhitespaceFromNodes(ssrVNode.elm);

      expect(elm.getAttribute(SSR_VNODE_ID)).toBe('1');
      expect(elm.firstElementChild.getAttribute(SSR_CHILD_ID)).toBe('1.0.');
      expect(elm.firstElementChild.innerHTML).toBe('<child-a></child-a>');
    });

    it('should add same ssr to all elements', () => {
      newVnode = h('ion-test', 0, [
        h('div', 0, [
          h('button', 0, 'Text 1'),
          h('span', 0, 'Text 2')
        ])
      ]);

      ssrVNode = patch(oldVnode, newVnode, false, null, 1);
      elm = <any>ssrVNode.elm;

      expect(elm.getAttribute(SSR_VNODE_ID)).toBe('1');
      expect(elm.querySelector('div').getAttribute(SSR_CHILD_ID)).toBe('1.0');
      expect(elm.querySelector('button').getAttribute(SSR_CHILD_ID)).toBe('1.0');
      expect(elm.querySelector('button').innerHTML).toBe('<!--s.1.0-->Text 1<!--/--> ');
      expect(elm.querySelector('span').getAttribute(SSR_CHILD_ID)).toBe('1.1');
      expect(elm.querySelector('span').innerHTML).toBe('<!--s.1.0-->Text 2<!--/--> ');
    });

  });


  var domApi = mockDomApi();

  beforeEach(() => {
    domApi = mockDomApi();
  });


  var plt = mockPlatform();
  var patch = createRendererPatch(<any>plt, domApi);

});
