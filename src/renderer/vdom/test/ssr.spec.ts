import * as d from '@declarations';
import { connectElement } from '../../../server/connect-element';
import { createRendererPatch } from '../patch';
import { createVNodesFromSsr } from '../ssr';
import { ENCAPSULATION, SSR_CHILD_ID, SSR_VNODE_ID } from '@utils';
import { h } from '../h';
import { initHostSnapshot } from '../../../core/host-snapshot';
import { mockDomApi, mockPlatform, removeWhitespaceFromNodes } from '../../../testing/mocks';


describe('ssr', () => {

  const plt = mockPlatform();
  let domApi: d.DomApi;
  let patch: d.RendererApi;

  beforeEach(() => {
    domApi = mockDomApi();
    patch = createRendererPatch(<any>plt, domApi);
  });


  describe('ssr vnode', () => {

    it('should get text from deep nested default slot', () => {
      const rootElm = domApi.$createElement('div');
      rootElm.innerHTML = `
        <cmp-a ssrv="1">
          <cmp-b ssrc="1.0" ssrv="4">
            <cmp-c ssrc="4.0">
              <cmp-d ssrc="4.0.">
                <!--s.1.0-->News<!--/-->
              </cmp-d>
            </cmp-c>
          </cmp-b>
        </cmp-a>
      `;
      removeWhitespaceFromNodes(rootElm);

      createVNodesFromSsr(plt, domApi, rootElm);

      const cmpA = plt.vnodeMap.get(rootElm.querySelector('cmp-a'));
      expect(cmpA.vchildren).toHaveLength(1);
      expect(cmpA.vchildren[0].vtag).toBe('cmp-b');
      expect(cmpA.vchildren[0].vchildren).toHaveLength(1);
    });

    it('should create a vnode from complex html', () => {
      const rootElm = domApi.$createElement('div');
      rootElm.innerHTML = `
        <cmp-a ssrv="1">
          <cmp-b ssrc="1.0" ssrv="2">
            <!--s.2.0-->TEXT 1<!--/-->
            <cmp-c ssrc="2.1." ssrv="4">
              <!--s.1.0-->TEXT 2<!--/-->
              <!--s.1.1-->TEXT 3<!--/-->
              <!--s.4.0-->TEXT 7<!--/-->
              <cmp-d ssrc="1.2." ssrv="3">
                <cmp-f ssrc="3.0.">
                  <!--s.3.0-->TEXT 6<!--/-->
                </cmp-f>
              </cmp-d>
              <cmp-e ssrc="1.3." ssrv="5">
                <!--s.1.0-->TEXT 5<!--/-->
              </cmp-e>
              <!--s.1.4-->TEXT 4<!--/-->
            </cmp-c>
          </cmp-b>
        </cmp-a>
      `;
      removeWhitespaceFromNodes(rootElm);

      createVNodesFromSsr(plt, domApi, rootElm);

      const cmpA = plt.vnodeMap.get(rootElm.querySelector('cmp-a'));
      expect(cmpA.vchildren).toHaveLength(1);
      expect(cmpA.vchildren[0].vtag).toBe('cmp-b');
      expect(cmpA.vchildren[0].vchildren[0].vtext).toBe('TEXT 2');
      expect(cmpA.vchildren[0].vchildren[1].vtext).toBe('TEXT 3');
      expect(cmpA.vchildren[0].vchildren[2].vtag).toBe('cmp-d');
      expect(cmpA.vchildren[0].vchildren[3].vtag).toBe('cmp-e');
      expect(cmpA.vchildren[0].vchildren[3].vchildren).toHaveLength(1);
      expect(cmpA.vchildren[0].vchildren[3].vchildren[0].vtext).toBe('TEXT 5');
      expect(cmpA.vchildren[0].vchildren[4].vtext).toBe('TEXT 4');
      expect(cmpA.vchildren[0].vchildren).toHaveLength(5);

      const cmpB = plt.vnodeMap.get(rootElm.querySelector('cmp-b'));
      expect(cmpB.vchildren).toHaveLength(2);
      expect(cmpB.vchildren[0].vtext).toBe('TEXT 1');
      expect(cmpB.vchildren[1].vtag).toBe('cmp-c');

      const cmpC = plt.vnodeMap.get(rootElm.querySelector('cmp-c'));
      expect(cmpC.vchildren).toHaveLength(1);
      expect(cmpC.vchildren[0].vtext).toBe('TEXT 7');

      const cmpD = plt.vnodeMap.get(rootElm.querySelector('cmp-d'));
      expect(cmpD.vchildren).toHaveLength(1);
      expect(cmpD.vchildren[0].vtag).toBe('cmp-f');
      expect(cmpD.vchildren[0].vchildren[0].vtext).toBe('TEXT 6');

      const cmpE = plt.vnodeMap.get(rootElm.querySelector('cmp-e'));
      expect(cmpE.vchildren).toBeUndefined();
    });

    it('should create a vnode from nested default slots html', () => {
      const rootElm = domApi.$createElement('div');
      rootElm.innerHTML = `
        <cmp-a ssrv="0">
          <cmp-b ssrv="1" ssrc="0.0">
            <!--s.1.0-->
            88
          </cmp-b>
          <cmp-c ssrv="2" ssrc="0.1">
            <!--s.2.0-->
            mph
          </cmp-c>
        </cmp-a>
      `;
      removeWhitespaceFromNodes(rootElm);

      createVNodesFromSsr(plt, domApi, rootElm);

      const cmpA = plt.vnodeMap.get(rootElm.querySelector('cmp-a'));
      expect(cmpA.vchildren).toHaveLength(2);
      expect(cmpA.vchildren[0].vtag).toBe('cmp-b');
      expect(cmpA.vchildren[1].vtag).toBe('cmp-c');

      const cmpB = plt.vnodeMap.get(rootElm.querySelector('cmp-b'));
      expect(cmpB.vchildren).toHaveLength(1);
      expect(cmpB.vchildren[0].vtext).toBe('88');

      const cmpC = plt.vnodeMap.get(rootElm.querySelector('cmp-c'));
      expect(cmpC.vchildren).toHaveLength(1);
      expect(cmpC.vchildren[0].vtext).toBe('mph');
    });

  });

  describe('render for ssr output', () => {
    var oldVnode: d.VNode;
    var newVnode: d.VNode;
    var ssrVNode: d.VNode;
    var hostElm: d.RenderNode;

    beforeEach(() => {
      oldVnode = {};
      hostElm = domApi.$createElement('ion-test');
      oldVnode.elm = hostElm;
    });

    it('should add default slot comments', () => {
      newVnode = h('ion-test', null,
        h('div', null,
          h('slot', null)
        )
      );

      initHostSnapshot(domApi, {}, hostElm as d.HostElement);

      const defaultContentNode = domApi.$createElement('child-a');
      hostElm.appendChild(defaultContentNode);

      ssrVNode = patch(hostElm, oldVnode, newVnode, false, 'none', 1);
      hostElm = removeWhitespaceFromNodes(ssrVNode.elm);

      expect(hostElm.getAttribute(SSR_VNODE_ID)).toBe('1');
      expect(hostElm.firstElementChild.getAttribute(SSR_CHILD_ID)).toBe('1.0.');
      expect(hostElm.firstElementChild.innerHTML).toBe('<child-a></child-a>');
    });

    it('should add same ssr to all elements', () => {
      newVnode = h('ion-test', null,
        h('div', null,
          h('button', null, 'Text 1'),
          h('span', null, 'Text 2')
        )
      );

      ssrVNode = patch(hostElm, oldVnode, newVnode, false, 'none', 1);
      hostElm = <any>ssrVNode.elm;

      expect(hostElm.getAttribute(SSR_VNODE_ID)).toBe('1');
      expect(hostElm.querySelector('div').getAttribute(SSR_CHILD_ID)).toBe('1.0');
      expect(hostElm.querySelector('button').getAttribute(SSR_CHILD_ID)).toBe('1.0');
      expect(hostElm.querySelector('button').innerHTML).toBe('<!--s.1.0-->Text 1<!--/-->');
      expect(hostElm.querySelector('span').getAttribute(SSR_CHILD_ID)).toBe('1.1');
      expect(hostElm.querySelector('span').innerHTML).toBe('<!--s.1.0-->Text 2<!--/-->');
    });

  });

});
