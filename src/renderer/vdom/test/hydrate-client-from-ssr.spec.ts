import * as d from '../../../declarations';
import { hydrateClientFromSsr } from '../hydrate-client-from-ssr';
import { mockDomApi, mockPlatform } from '../../../testing/mocks';


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

});
