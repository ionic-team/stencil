import * as d from '../../../declarations';
import { addShadowDomSsrData, createRendererPatch } from '../patch';
import { compareHtml, mockDomApi, mockElement, mockPlatform, removeWhitespaceFromNodes } from '../../../testing/mocks';
import { createVNodesFromSsr } from '../hydrate-client-from-ssr';
import { h } from '../h';
import { initHostSnapshot } from '../../../core/host-snapshot';
import { SSR_CHILD_ID, SSR_HOST_ID, SSR_LIGHT_DOM_ATTR, SSR_SHADOW_DOM_HOST_ID } from '../../../util/constants';


describe('ssr', () => {

  const plt = mockPlatform();
  let domApi: d.DomApi;
  let patch: d.RendererApi;

  beforeEach(() => {
    domApi = mockDomApi();
    patch = createRendererPatch(<any>plt, domApi);
  });

  describe('addShadowDomSsrData', () => {

    it('should add shadow dom host attribute', () => {
      const elm = mockElement('cmp-a');
      addShadowDomSsrData(domApi, elm, 88);
      expect(elm.getAttribute(SSR_HOST_ID)).toBe('88.s');
    });

    it('should add light dom attributes to elements', () => {
      const elm = mockElement('cmp-a');
      elm.innerHTML = `
        <header></header>
        <article></article>
        <footer></footer>
      `;
      addShadowDomSsrData(domApi, elm, 88);

      const header = elm.querySelector('header');
      expect(header.hasAttribute(SSR_LIGHT_DOM_ATTR)).toBe(true);

      const article = elm.querySelector('article');
      expect(article.hasAttribute(SSR_LIGHT_DOM_ATTR)).toBe(true);

      const footer = elm.querySelector('footer');
      expect(footer.hasAttribute(SSR_LIGHT_DOM_ATTR)).toBe(true);
    });

    it('should place light dom comment before text node', () => {
      const elm = mockElement('cmp-a');
      elm.innerHTML = `
        light-dom text node
      `;
      addShadowDomSsrData(domApi, elm, 88);

      expect(compareHtml(elm.innerHTML)).toBe(compareHtml(`
        <!--l.88.0-->
          light-dom text node
      `));
    });

    it('should mix elements and text nodes', () => {
      const elm = mockElement('cmp-a');
      elm.innerHTML = `
        light-dom text node
        <a></a>
      `;
      addShadowDomSsrData(domApi, elm, 88);

      expect(compareHtml(elm.innerHTML)).toBe(compareHtml(`
        <!--l.88.0-->
          light-dom text node
        <a ssrl="88.2"></a>
      `));
    });

  });

  describe('ssr vnode', () => {

    it('should get text from deep nested default slot', () => {
      const rootElm = domApi.$createElement('div');
      rootElm.innerHTML = `
        <cmp-a ssrh="1">
          <cmp-b ssrc="1.0" ssrh="4">
            <cmp-c ssrc="4.0">
              <cmp-d ssrc="4.0.">
                <!--t.1.0-->News<!--/-->
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
        <cmp-a ssrh="1">
          <cmp-b ssrc="1.0" ssrh="2">
            <!--t.2.0-->TEXT 1<!--/-->
            <cmp-c ssrc="2.1." ssrh="4">
              <!--t.1.0-->TEXT 2<!--/-->
              <!--t.1.1-->TEXT 3<!--/-->
              <!--t.4.0-->TEXT 7<!--/-->
              <cmp-d ssrc="1.2." ssrh="3">
                <cmp-f ssrc="3.0.">
                  <!--t.3.0-->TEXT 6<!--/-->
                </cmp-f>
              </cmp-d>
              <cmp-e ssrc="1.3." ssrh="5">
                <!--t.1.0-->TEXT 5<!--/-->
              </cmp-e>
              <!--t.1.4-->TEXT 4<!--/-->
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
        <cmp-a ssrh="0">
          <cmp-b ssrh="1" ssrc="0.0">
            <!--t.1.0-->
            88
          </cmp-b>
          <cmp-c ssrh="2" ssrc="0.1">
            <!--t.2.0-->
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
    var ssrhNode: d.VNode;
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

      ssrhNode = patch(hostElm, oldVnode, newVnode, false, 'none', 1);
      hostElm = removeWhitespaceFromNodes(ssrhNode.elm);

      expect(hostElm.getAttribute(SSR_HOST_ID)).toBe('1');
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

      ssrhNode = patch(hostElm, oldVnode, newVnode, false, 'none', 1);
      hostElm = <any>ssrhNode.elm;

      expect(hostElm.getAttribute(SSR_HOST_ID)).toBe('1');
      expect(hostElm.querySelector('div').getAttribute(SSR_CHILD_ID)).toBe('1.0');
      expect(hostElm.querySelector('button').getAttribute(SSR_CHILD_ID)).toBe('1.0');
      expect(hostElm.querySelector('button').innerHTML).toBe('<!--s.1.0-->Text 1<!--/--> ');
      expect(hostElm.querySelector('span').getAttribute(SSR_CHILD_ID)).toBe('1.1');
      expect(hostElm.querySelector('span').innerHTML).toBe('<!--s.1.0-->Text 2<!--/--> ');
    });

  });

});
