import * as d from '../../../declarations';
import { compareHtml, mockConfig, mockDomApi, mockHtml, mockPlatform  } from '../../../testing/mocks';
import { hydrateClientFromSsr } from '../hydrate-client-from-ssr';
import { ENCAPSULATION, NODE_TYPE } from '../../../util/constants';
import { h } from '../h';
import { hydrateHtml } from '../../../server/hydrate-html';


describe('ssr shadow dom', () => {

  const plt = mockPlatform();
  let domApi: d.DomApi;

  let config: d.Config;
  let outputTarget: d.OutputTargetHydrate;

  beforeEach(() => {
    config = mockConfig();
    outputTarget = config.outputTargets[0] as d.OutputTargetHydrate;
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

  it('hydrate and parse ssr client, w/ slot', async () => {
    const ctx: d.CompilerCtx = {};
    const registry: d.ComponentRegistry = {
      'cmp-a': {
        bundleIds: 'cmp-a',
        tagNameMeta: 'cmp-a',
        encapsulationMeta: ENCAPSULATION.ShadowDom,
        componentConstructor: class {
          static get is() {
            return 'cmp-a';
          }
          static get encapsulation() {
            return 'shadow';
          }
          render() {
            return [
              h('header', null, 'cmp-a shadow-dom'),
              h('slot', null)
            ];
          }
        } as any
      },
      'cmp-b': {
        bundleIds: 'cmp-b',
        tagNameMeta: 'cmp-b',
        encapsulationMeta: ENCAPSULATION.ShadowDom,
        componentConstructor: class {
          static get is() {
            return 'cmp-b';
          }
          static get encapsulation() {
            return 'shadow';
          }
          render() {
            return h('div', null,
              h('slot', null),
              h('section', null, 'cmp-b shadow-dom'),
              h('slot', { name: 'named-slot' }),
              h('cmp-c', null, 'cmp-c light-dom')
            );
          }
        } as any
      },
      'cmp-c': {
        bundleIds: 'cmp-c',
        tagNameMeta: 'cmp-c',
        encapsulationMeta: ENCAPSULATION.ShadowDom,
        componentConstructor: class {
          static get is() {
            return 'cmp-c';
          }
          static get encapsulation() {
            return 'shadow';
          }
          render() {
            return h('footer', null, 'cmp-c shadow-dom');
          }
        } as any
      }
    };

    const cmpAInstance = new (registry as any)['cmp-a'].componentConstructor();
    const cmpARender: d.VNode[] = cmpAInstance.render();

    const cmpBInstance = new (registry as any)['cmp-b'].componentConstructor();
    const cmpBRender: d.VNode[] = cmpBInstance.render();

    const cmpCInstance = new (registry as any)['cmp-c'].componentConstructor();
    const cmpCRender: d.VNode[] = cmpCInstance.render();

    const opts: d.HydrateOptions = {
      html: `
        <cmp-a>
          cmp-a light-dom top
          <cmp-b>
            <article>cmp-b light-dom</article>
            <nav slot="named-slot">cmp-b light-dom</nav>
          </cmp-b>
          <span>cmp-a light-dom bottom</span>
        </cmp-a>
      `
    };

    const ssrResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);

    expect(ssrResults.diagnostics).toHaveLength(0);

    expect(compareHtml(ssrResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head></head>
        <body>
          <cmp-a class="scs-cmp-a-h scs-cmp-a-s hydrated" ssrh="s0">
            <header class="scs-cmp-a" ssrc="0.0">
              <!--t.0.0-->
                cmp-a shadow-dom
              <!--/-->
            </header>
            <!--s.0.1-->
            <!--l.0.1-->
              cmp-a light-dom top
            <cmp-b ssrl="0.3" class="scs-cmp-b-h hydrated" ssrh="s1">
              <div class="scs-cmp-b scs-cmp-b-s" ssrc="1.0">
                <!--s.1.0-->
                <article ssrl="1.2">
                  cmp-b light-dom
                </article>
                <section class="scs-cmp-b" ssrc="1.1">
                  <!--t.1.0-->
                    cmp-bshadow-dom
                  <!--/-->
                </section>
                <!--s.1.2.named-slot-->
                <nav slot="named-slot" ssrl="1.4">
                  cmp-b light-dom
                </nav>
                <cmp-c class="scs-cmp-b scs-cmp-c-h hydrated" ssrc="1.3" ssrh="s2">
                  <!--t.1.0-->
                    <!--l.2.2-->
                      cmp-c light-dom
                  <!--/-->
                  <footer class="scs-cmp-c" ssrc="2.0">
                    <!--t.2.0-->
                      cmp-c shadow-dom
                    <!--/-->
                  </footer>
                </cmp-c>
              </div>
            </cmp-b>
            <span ssrl="0.5">
              cmp-a light-dom bottom
            </span>
          </cmp-a>
        </body>
      </html>
    `));

    const hydratedRoot = mockHtml('<div>' + ssrResults.html + '</div>');

    hydrateClientFromSsr(plt, domApi, hydratedRoot);

    const cmpAElm = hydratedRoot.querySelector('cmp-a') as d.HostElement;
    const cmpASsrVnode = plt.vnodeMap.get(cmpAElm);
    expect(cmpASsrVnode.vtag).toBe('cmp-a');
    expect(cmpASsrVnode.elm).toBe(cmpAElm);
    isSameVChildren(cmpARender, cmpASsrVnode.vchildren);

    const cmpBElm = hydratedRoot.querySelector('cmp-b') as d.HostElement;
    const cmpBSsrVnode = plt.vnodeMap.get(cmpBElm);
    expect(cmpBSsrVnode.vtag).toBe('cmp-b');
    expect(cmpBSsrVnode.elm).toBe(cmpBElm);
    isSameVChildren(cmpBRender, cmpBSsrVnode.vchildren);

    const cmpCElm = hydratedRoot.querySelector('cmp-c') as d.HostElement;
    const cmpCSsrVnode = plt.vnodeMap.get(cmpCElm);
    expect(cmpCSsrVnode.vtag).toBe('cmp-c');
    expect(cmpCSsrVnode.elm).toBe(cmpCElm);
    isSameVChildren(cmpCRender, cmpCSsrVnode.vchildren);


    // expect(compareHtml(hydratedRoot.innerHTML)).toBe(compareHtml(`
    //   <cmp-a class="hydrated">
    //     <shadow-root>
    //       <header>
    //         cmp-a shadow-dom
    //       </header>
    //       <slot></slot>
    //       cmp-a light-dom top
    //       <cmp-b class="hydrated">
    //         <shadow-root>
    //           <div>
    //             <slot></slot>
    //             <article>
    //               cmp-b light-dom
    //             </article>
    //             <section>
    //               cmp-b shadow-dom
    //             </section>
    //             <slot name="named-slot"></slot>
    //             <nav slot="named-slot">
    //               cmp-b light-dom
    //             </nav>
    //             <cmp-c class="hydrated">
    //               <shadow-root>
    //                 cmp-c light-dom
    //                 <footer>
    //                   cmp-c shadow-dom
    //                 </footer>
    //               </shadow-root>
    //             </cmp-c>
    //           </div>
    //         </shadow-root>
    //       </cmp-b>
    //       <span>
    //         cmp-a light-dom bottom
    //       </span>
    //     </shadow-root>
    //   </cmp-a>
    // `));
  });

});


function isSameVChildren(a: d.VNode[], b: d.VNode[]) {
  if (!a) {
    expect(a).toEqual(b);
    return;
  }

  if (!Array.isArray(a)) {
    a = [a];
  }

  expect(a.length).toBe(b.length);

  for (let i = 0; i < a.length; i++) {
    isSameVNode(a[i], b[i]);
  }
}

function isSameVNode(a: d.VNode, b: d.VNode) {
  expect(a.vtag).toBe(b.vtag);
  expect(a.vtext).toBe(b.vtext);
  expect(a.vattrs).toEqual(b.vattrs);
  expect(a.vname).toBe(b.vname);
  expect(a.vkey).toBe(b.vkey);
  isSameVChildren(a.vchildren, b.vchildren);

  if (typeof a.vtext === 'string') {
    expect(b.elm.nodeType).toBe(NODE_TYPE.TextNode);
    expect(b.elm.textContent).toBe(a.vtext);
  } else {
    expect(b.elm.nodeType).toBe(NODE_TYPE.ElementNode);
  }
}
