import * as d from '../../../declarations';
import { compareHtml, mockConfig, mockDomApi, mockHtml, mockPlatform  } from '../../../testing/mocks';
import { hydrateClientFromSsr } from '../hydrate-client-from-ssr';
import { ENCAPSULATION, NODE_TYPE } from '../../../util/constants';
import { h } from '../h';
import { hydrateHtml } from '../../../server/hydrate-html';


describe('ssr scoped css', () => {

  const plt = mockPlatform();
  let domApi: d.DomApi;

  let config: d.Config;
  let outputTarget: d.OutputTargetHydrate;

  beforeEach(() => {
    config = mockConfig();
    outputTarget = config.outputTargets[0] as d.OutputTargetHydrate;
    domApi = mockDomApi();
    domApi.$supportsShadowDom = false;
  });

  it('hydrate and parse ssr client, w/ slot', async () => {
    const ctx: d.CompilerCtx = {};
    const registry: d.ComponentRegistry = {
      'cmp-a': {
        bundleIds: 'cmp-a',
        tagNameMeta: 'cmp-a',
        encapsulationMeta: ENCAPSULATION.ScopedCss,
        componentConstructor: class {
          static get is() {
            return 'cmp-a';
          }
          static get encapsulation() {
            return 'scoped';
          }
          render() {
            return [
              h('header', null, 'cmp-a scope-encapsulated'),
              h('slot', null)
            ];
          }
        } as any
      },
      'cmp-b': {
        bundleIds: 'cmp-b',
        tagNameMeta: 'cmp-b',
        encapsulationMeta: ENCAPSULATION.ScopedCss,
        componentConstructor: class {
          static get is() {
            return 'cmp-b';
          }
          static get encapsulation() {
            return 'scoped';
          }
          render() {
            return h('div', null,
              h('slot', null),
              h('section', null, 'cmp-b scope-encapsulated'),
              h('slot', { name: 'named-slot' }),
              h('cmp-c', null, 'cmp-c light-dom')
            );
          }
        } as any
      },
      'cmp-c': {
        bundleIds: 'cmp-c',
        tagNameMeta: 'cmp-c',
        encapsulationMeta: ENCAPSULATION.ScopedCss,
        componentConstructor: class {
          static get is() {
            return 'cmp-c';
          }
          static get encapsulation() {
            return 'scoped';
          }
          render() {
            return h('footer', null, 'cmp-c scope-encapsulated');
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
            <article>cmp-b light-dom top</article>
            <nav slot="named-slot">cmp-b light-dom bottom</nav>
          </cmp-b>
          <span>cmp-a light-dom bottom</span>
        </cmp-a>
      `
    };

    const ssrResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);

    expect(ssrResults.diagnostics).toHaveLength(0);

    expect(ssrResults.html).toEqualHtml(`
      <html dir="ltr" data-ssr="">
        <head></head>
        <body>
          <cmp-a class="scs-cmp-a-h scs-cmp-a-s hydrated" ssrh="0">
            <!--c.0-->
            <!--o.0.0-->
            <!--o.0.1-->
            <!--o.0.3-->
            <header class="scs-cmp-a" ssrc="0.0">
              <!--t.0.0-->
                cmp-a scope-encapsulated
              <!--/t-->
            </header>
            <!--s.0.1-->
            <!--l.0.0-->
            cmp-a light-dom top
            <cmp-b class="scs-cmp-b-h hydrated" ssrh="1" ssrl="0.1">
              <!--c.1-->
              <!--o.1.1-->
              <!--o.1.3-->
              <div class="scs-cmp-b scs-cmp-b-s" ssrc="1.0">
                <!--s.1.0-->
                <article ssrl="1.1">
                  cmp-b light-dom top
                </article>
                <section class="scs-cmp-b" ssrc="1.1">
                  <!--t.1.0-->
                    cmp-b scope-encapsulated
                  <!--/t-->
                </section>
                <!--s.1.2.named-slot-->
                <nav slot="named-slot" ssrl="1.3">
                  cmp-b light-dom bottom
                </nav>
                <cmp-c class="scs-cmp-b scs-cmp-c-h hydrated" ssrh="2" ssrc="1.3">
                  <!--c.2-->
                  <!--l.2.0-->
                  <!--t.1.0-->
                    cmp-c light-dom
                  <!--/t-->
                  <footer class="scs-cmp-c" ssrc="2.0">
                    <!--t.2.0-->
                      cmp-c scope-encapsulated
                    <!--/t-->
                  </footer>
                </cmp-c>
              </div>
            </cmp-b>
            <span ssrl="0.3">
              cmp-a light-dom bottom
            </span>
          </cmp-a>
        </body>
      </html>
    `);

    const hydratedRoot = mockHtml('<div>' + ssrResults.html + '</div>');

    hydrateClientFromSsr(plt, domApi, hydratedRoot);

    // const cmpAHost = hydratedRoot.querySelector('cmp-a') as d.HostElement;
    // const cmpASsrVnode = plt.vnodeMap.get(cmpAHost);
    // expect(cmpASsrVnode.vtag).toBe('cmp-a');
    // expect(cmpASsrVnode.elm).toBe(cmpAHost);
    // isSameVChildren(cmpARender, cmpASsrVnode.vchildren);

    // const cmpAContentRef = cmpAHost['s-cr'];
    // expect(cmpAContentRef).toBeDefined();
    // expect(cmpAContentRef.nodeType).toBe(NODE_TYPE.TextNode);
    // expect(cmpAContentRef['s-cn']).toBe(true);
    // expect(cmpAContentRef.parentNode).toBe(cmpAHost);
    // expect(domApi.$childNodes(cmpAHost)[0]).toBe(cmpAContentRef);

    // const cmpAHeader = cmpAHost.querySelector('header') as d.RenderNode;
    // expect(cmpAHeader['s-hn']).toBe('cmp-a');

    // const cmpAHeaderTextComment = cmpAHeader.firstChild as d.RenderNode;
    // expect(cmpAHeaderTextComment['s-hn']).toBe('cmp-a');

    // const cmpBHost = hydratedRoot.querySelector('cmp-b') as d.HostElement;
    // const cmpBSsrVnode = plt.vnodeMap.get(cmpBHost);
    // expect(cmpBSsrVnode.vtag).toBe('cmp-b');
    // expect(cmpBSsrVnode.elm).toBe(cmpBHost);
    // isSameVChildren(cmpBRender, cmpBSsrVnode.vchildren);

    // const cmpBContentRef = cmpBHost['s-cr'];
    // expect(cmpBContentRef).toBeDefined();
    // expect(cmpBContentRef.nodeType).toBe(NODE_TYPE.TextNode);
    // expect(cmpBContentRef['s-cn']).toBe(true);
    // expect(cmpBContentRef.parentNode).toBe(cmpBHost);
    // expect(domApi.$childNodes(cmpBHost)[0]).toBe(cmpBContentRef);

    // const cmpBDiv = cmpBHost.querySelector('div') as d.RenderNode;
    // expect(cmpBDiv['s-hn']).toBe('cmp-b');

    // const cmpBSection = cmpBHost.querySelector('section') as d.RenderNode;
    // expect(cmpBSection['s-hn']).toBe('cmp-b');

    // const cmpCHost = hydratedRoot.querySelector('cmp-c') as d.HostElement;
    // const cmpCSsrVnode = plt.vnodeMap.get(cmpCHost);
    // expect(cmpCSsrVnode.vtag).toBe('cmp-c');
    // expect(cmpCSsrVnode.elm).toBe(cmpCHost);
    // isSameVChildren(cmpCRender, cmpCSsrVnode.vchildren);

    // const cmpCContentRef = cmpCHost['s-cr'];
    // expect(cmpCContentRef).toBeDefined();
    // expect(cmpCContentRef.nodeType).toBe(NODE_TYPE.TextNode);
    // expect(cmpCContentRef['s-cn']).toBe(true);
    // expect(cmpCContentRef.parentNode).toBe(cmpCHost);
    // expect(domApi.$childNodes(cmpCHost)[0]).toBe(cmpCContentRef);

    expect(hydratedRoot.innerHTML).toEqualHtml(`
      <cmp-a class="scs-cmp-a-h scs-cmp-a-s hydrated" ssrh="0">
        <!--c.0-->
        <!--o.0.0-->
        <!--o.0.1-->
        <!--o.0.3-->
        <header class="scs-cmp-a" ssrc="0.0">
          <!--t.0.0-->
            cmp-a scope-encapsulated
          <!--/t-->
        </header>
        <!--s.0.1-->
        <!--l.0.0-->
        cmp-a light-dom top
        <cmp-b class="scs-cmp-b-h hydrated" ssrh="1" ssrl="0.1">
          <!--c.1-->
          <!--o.1.1-->
          <!--o.1.3-->
          <div class="scs-cmp-b scs-cmp-b-s" ssrc="1.0">
            <!--s.1.0-->
            <article ssrl="1.1">
              cmp-b light-dom top
            </article>
            <section class="scs-cmp-b" ssrc="1.1">
              <!--t.1.0-->
                cmp-b scope-encapsulated
              <!--/t-->
            </section>
            <!--s.1.2.named-slot-->
            <nav slot="named-slot" ssrl="1.3">
              cmp-b light-dom bottom
            </nav>
            <cmp-c class="scs-cmp-b scs-cmp-c-h hydrated" ssrh="2" ssrc="1.3">
              <!--c.2-->
              <!--l.2.0-->
              <!--t.1.0-->
                cmp-c light-dom
              <!--/t-->
              <footer class="scs-cmp-c" ssrc="2.0">
                <!--t.2.0-->
                  cmp-c scope-encapsulated
                <!--/t-->
              </footer>
            </cmp-c>
          </div>
        </cmp-b>
        <span ssrl="0.3">
          cmp-a light-dom bottom
        </span>
      </cmp-a>
    `);

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
