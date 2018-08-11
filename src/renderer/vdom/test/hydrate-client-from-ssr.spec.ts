import * as d from '../../../declarations';
import { hydrateClientFromSsr } from '../hydrate-client-from-ssr';
import { mockDomApi, mockPlatform, removeWhitespaceFromNodes } from '../../../testing/mocks';


describe('hydrateClientFromSsr', () => {

  let domApi: d.DomApi;
  let plt: d.PlatformApi;

  beforeEach(() => {
    plt = mockPlatform();
    domApi = mockDomApi();
    domApi.$supportsShadowDom = true;
    domApi.$attachShadow = (elm) => {
      // mock a shadow root for testing
      const shadowRoot = domApi.$createElement('shadow-root');
      domApi.$insertBefore(elm, shadowRoot, elm.firstChild);
      return shadowRoot;
    };
    domApi.$childNodes = (node) => {
      // since we're mocking the shadow root for testing
      // make sure childNodes doesn't include the shadow root like native
      const childNodes: Node[] = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeName.toLowerCase() !== 'shadow-root') {
          childNodes.push(node.childNodes[i]);
        }
      }
      return childNodes as any;
    };
  });

  it('should move light dom nodes back to root and create slots', () => {
    const rootElm = domApi.$createElement('html');
    rootElm.innerHTML = `
      <html dir="ltr" data-ssr="">
        <head></head>
        <body>
          <cmp-a class="scs-cmp-a-h scs-cmp-a-s hydrated" ssrh="s0">
            <header class="scs-cmp-a" ssrc="0.0.t">
              cmp-a shadow-dom
            </header>
            <!--s.0.1-->
            <!--l.0.1-->cmp-a light-dom top
            <span ssrl="0.5">
              cmp-a light-dom bottom
            </span>
          </cmp-a>
        </body>
      </html>
    `;

    hydrateClientFromSsr(plt, domApi, rootElm);

    expect(rootElm.outerHTML).toEqualHtml(`
      <html>
        <head></head>
        <body>
          <cmp-a class="scs-cmp-a-h scs-cmp-a-s hydrated">
            <shadow-root>
              <header class="scs-cmp-a">
                cmp-a shadow-dom
              </header>
              <slot></slot>
            </shadow-root>
            cmp-a light-dom top
            <span>
              cmp-a light-dom bottom
            </span>
          </cmp-a>
        </body>
      </html>
    `);
  });

  it('move all node types in host content into the shadow root', () => {
    const rootElm = domApi.$createElement('html');
    rootElm.innerHTML = `
      <cmp-a ssrh="s0">
        88
        <span>
          <b>mph</b>
        </span>
        <!--1955-->
      </cmp-a>
    `;

    hydrateClientFromSsr(plt, domApi, rootElm);

    expect(rootElm.outerHTML).toEqualHtml(`
      <html>
        <head></head>
        <body>
          <cmp-a>
            <shadow-root>
              88
              <span>
                <b>mph</b>
              </span>
              <!--1955-->
            </shadow-root>
          </cmp-a>
        </body>
      </html>
    `);
  });

  it('add shadow root', () => {
    const rootElm = domApi.$createElement('html');
    rootElm.innerHTML = `
      <cmp-a ssrh="s0"></cmp-a>
    `;

    hydrateClientFromSsr(plt, domApi, rootElm);

    expect(rootElm.outerHTML).toEqualHtml(`
      <html>
        <head></head>
        <body>
          <cmp-a>
            <shadow-root></shadow-root>
          </cmp-a>
        </body>
      </html>
    `);
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

      hydrateClientFromSsr(plt, domApi, rootElm);

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

      hydrateClientFromSsr(plt, domApi, rootElm);

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

      hydrateClientFromSsr(plt, domApi, rootElm);

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

});
