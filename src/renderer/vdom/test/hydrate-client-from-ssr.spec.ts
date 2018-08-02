import * as d from '../../../declarations';
import { compareHtml, mockDomApi } from '../../../testing/mocks';
import { upgradeShadowDomComponents } from '../hydrate-client-from-ssr';


describe('upgradeShadowDomComponents', () => {

  let domApi: d.DomApi;

  beforeEach(() => {
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
      <cmp-a class="scs-cmp-a-h" ssrsd="" ssrv="0">
        <div class="scs-cmp-a scs-cmp-a-s" ssrc="0.0">
          <section class="scs-cmp-a" ssrc="0.0">
            <!--s.0.0-->Shadow Content<!--/-->
          </section>
          <!--l.0.1.-->
          <!--l.0.2.named-slot-->
        </div>
      </cmp-a>
    `;

    upgradeShadowDomComponents(domApi, rootElm);

    const html = rootElm.outerHTML;

    expect(compareHtml(html)).toBe(compareHtml(`
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
    `));
  });

  fit('move all node types in host content into the shadow root', () => {
    const rootElm = domApi.$createElement('html');
    rootElm.innerHTML = `
      <cmp-a ssrsd>
        88
        <span>
          <b>mph</b>
        </span>
        <!--1955-->
      </cmp-a>
    `;

    upgradeShadowDomComponents(domApi, rootElm);

    const html = rootElm.outerHTML;

    expect(compareHtml(html)).toBe(compareHtml(`
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
    `));
  });

  it('add shadow root, and remove ssrsd attribute', () => {
    const rootElm = domApi.$createElement('html');
    rootElm.innerHTML = `
      <cmp-a ssrsd></cmp-a>
    `;

    upgradeShadowDomComponents(domApi, rootElm);

    const html = rootElm.outerHTML;

    expect(compareHtml(html)).toBe(compareHtml(`
      <html>
        <head></head>
        <body>
          <cmp-a>
            <shadow-root></shadow-root>
          </cmp-a>
        </body>
      </html>
    `));
  });

  it('do nothing for no SD components', () => {
    const rootElm = domApi.$createElement('html');
    rootElm.innerHTML = `<p>no shadow here</p>`;

    upgradeShadowDomComponents(domApi, rootElm);

    const html = rootElm.outerHTML;

    expect(compareHtml(html)).toBe(compareHtml(`
      <html>
        <head></head>
        <body>
          <p>no shadow here</p>
        </body>
      </html>
    `));
  });

});
