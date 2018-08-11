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
            <header class="scs-cmp-a" ssrc="0.0.t">
              cmp-a scope-encapsulated
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
                <section class="scs-cmp-b" ssrc="1.1.t">
                  cmp-b scope-encapsulated
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
                  <footer class="scs-cmp-c" ssrc="2.0.t">
                    cmp-c scope-encapsulated
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

    const cmpAHost = hydratedRoot.querySelector('cmp-a') as d.HostElement;
    const cmpASsrVnode = plt.vnodeMap.get(cmpAHost);
    expect(cmpASsrVnode.vtag).toBe('cmp-a');
    expect(cmpASsrVnode.elm).toBe(cmpAHost);
    isSameVChildren(cmpARender, cmpASsrVnode.vchildren);

    const cmpAContentRef = cmpAHost.firstChild as d.RenderNode;
    expect(cmpAContentRef.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpAContentRef.textContent).toBe('');
    expect(cmpAHost['s-si']).toBeUndefined();
    expect(cmpAHost['s-hn']).toBeUndefined();
    expect(cmpAHost['s-cr']).toBe(cmpAContentRef);
    expect(cmpAHost['s-cr']['s-cn']).toBe(true);
    expect(cmpAHost['s-cr']['s-hn']).toBeUndefined();

    const cmpAOrgLoc0 = cmpAContentRef.nextSibling as d.RenderNode;
    expect(cmpAOrgLoc0.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpAOrgLoc0.textContent.trim()).toBe('');

    const cmpAOrgLoc1 = cmpAOrgLoc0.nextSibling as d.RenderNode;
    expect(cmpAOrgLoc1.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpAOrgLoc1.textContent.trim()).toBe('');

    const cmpAOrgLoc2 = cmpAOrgLoc1.nextSibling as d.RenderNode;
    expect(cmpAOrgLoc2.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpAOrgLoc2.textContent.trim()).toBe('');

    const cmpAHeader = cmpAOrgLoc2.nextSibling as d.RenderNode;
    expect(cmpAHeader.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpAHeader.nodeName).toBe('HEADER');
    expect(cmpAHeader['s-hn']).toBe('cmp-a');

    const cmpAHeaderText = cmpAHeader.firstChild as d.RenderNode;
    expect(cmpAHeaderText.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpAHeaderText.textContent.trim()).toBe('cmp-a scope-encapsulated');
    expect(cmpAHeaderText['s-hn']).toBe('cmp-a');

    const cmpASlot = cmpAHeader.nextSibling as d.RenderNode;
    expect(cmpASlot.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpASlot['s-hn']).toBe('cmp-a');
    expect(cmpASlot['s-sr']).toBe(true);
    expect(cmpASlot['s-cr']).toBe(cmpAContentRef);
    expect(cmpASlot['s-sn']).toBe('');

    const cmpALightDomTop = cmpASlot.nextSibling as d.RenderNode;
    expect(cmpALightDomTop.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpALightDomTop.textContent.trim()).toBe('cmp-a light-dom top');
    expect(cmpALightDomTop['s-hn']).toBeUndefined();
    expect(cmpALightDomTop['s-ol']).toBe(cmpAOrgLoc0);
    expect(cmpAOrgLoc0['s-nr']).toBe(cmpALightDomTop);

    const cmpBHost = cmpALightDomTop.nextSibling as d.RenderNode;
    expect(cmpBHost.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpBHost.nodeName).toBe('CMP-B');
    expect(cmpBHost['s-hn']).toBeUndefined();
    const cmpBSsrVnode = plt.vnodeMap.get(cmpBHost);
    expect(cmpBSsrVnode.vtag).toBe('cmp-b');
    expect(cmpBSsrVnode.elm).toBe(cmpBHost);
    isSameVChildren(cmpBRender, cmpBSsrVnode.vchildren);
    expect(cmpBHost['s-ol']).toBe(cmpAOrgLoc1);
    expect(cmpAOrgLoc1['s-nr']).toBe(cmpBHost);

    const cmpBContentRef = cmpBHost['s-cr'];
    expect(cmpBContentRef).toBeDefined();
    expect(cmpBContentRef.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBContentRef['s-cn']).toBe(true);
    expect(cmpBHost['s-cr']).toBe(cmpBContentRef);
    expect(cmpBHost['s-cr']['s-hn']).toBeUndefined();

    const cmpBOrgLoc0 = cmpBContentRef.nextSibling as d.RenderNode;
    expect(cmpBOrgLoc0.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBOrgLoc0.textContent.trim()).toBe('');

    const cmpBOrgLoc1 = cmpBOrgLoc0.nextSibling as d.RenderNode;
    expect(cmpBOrgLoc1.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBOrgLoc1.textContent.trim()).toBe('');

    const cmpBDiv = cmpBOrgLoc1.nextSibling as d.RenderNode;
    expect(cmpBDiv.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpBDiv.nodeName).toBe('DIV');
    expect(cmpBDiv['s-hn']).toBe('cmp-b');

    const cmpBDivSlot = cmpBDiv.firstChild as d.RenderNode;
    expect(cmpBDivSlot.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBDivSlot.textContent.trim()).toBe('');
    expect(cmpBDivSlot['s-hn']).toBe('cmp-b');
    expect(cmpBDivSlot['s-sr']).toBe(true);
    expect(cmpBDivSlot['s-cr']).toBe(cmpBContentRef);
    expect(cmpBDivSlot['s-sn']).toBe('');

    const cmpBArticle = cmpBDivSlot.nextSibling.nextSibling as d.RenderNode;
    expect(cmpBArticle.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpBArticle.nodeName).toBe('ARTICLE');
    expect(cmpBArticle['s-hn']).toBeUndefined();
    expect(cmpBArticle['s-ol']).toBe(cmpBOrgLoc0);
    expect(cmpBOrgLoc0['s-nr']).toBe(cmpBArticle);

    const cmpBArticleText = cmpBArticle.firstChild as d.RenderNode;
    expect(cmpBArticleText.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBArticleText.textContent.trim()).toBe('cmp-b light-dom top');
    expect(cmpBArticleText['s-hn']).toBeUndefined();

    const cmpBSection = cmpBArticle.nextSibling.nextSibling as d.RenderNode;
    expect(cmpBSection.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpBSection.nodeName).toBe('SECTION');
    expect(cmpBSection['s-hn']).toBe('cmp-b');

    const cmpBSectionText = cmpBSection.firstChild as d.RenderNode;
    expect(cmpBSectionText.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBSectionText.textContent.trim()).toBe('cmp-b scope-encapsulated');
    expect(cmpBSectionText['s-hn']).toBe('cmp-b');

    const cmpBDivNamedSlot = cmpBSection.nextSibling as d.RenderNode;
    expect(cmpBDivNamedSlot.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBDivNamedSlot.textContent.trim()).toBe('');
    expect(cmpBDivNamedSlot['s-hn']).toBe('cmp-b');
    expect(cmpBDivNamedSlot['s-sr']).toBe(true);
    expect(cmpBDivNamedSlot['s-cr']).toBe(cmpBContentRef);
    expect(cmpBDivNamedSlot['s-sn']).toBe('named-slot');

    const cmpBNav = cmpBDivNamedSlot.nextSibling as d.RenderNode;
    expect(cmpBNav.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpBNav.nodeName).toBe('NAV');
    expect(cmpBNav['s-hn']).toBeUndefined();
    expect(cmpBNav['s-ol']).toBe(cmpBOrgLoc1);
    expect(cmpBOrgLoc1['s-nr']).toBe(cmpBNav);

    const cmpBNavText = cmpBNav.firstChild as d.RenderNode;
    expect(cmpBNavText.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpBNavText.textContent.trim()).toBe('cmp-b light-dom bottom');
    expect(cmpBNavText['s-hn']).toBeUndefined();

    const cmpCHost = cmpBNav.nextSibling as d.RenderNode;
    expect(cmpCHost.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpCHost.nodeName).toBe('CMP-C');
    expect(cmpCHost['s-hn']).toBe('cmp-b');
    const cmpCSsrVnode = plt.vnodeMap.get(cmpCHost);
    expect(cmpCSsrVnode.vtag).toBe('cmp-c');
    expect(cmpCSsrVnode.elm).toBe(cmpCHost);
    isSameVChildren(cmpCRender, cmpCSsrVnode.vchildren);

    const cmpCContentRef = cmpCHost['s-cr'];
    expect(cmpCContentRef).toBeDefined();
    expect(cmpCContentRef.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpCContentRef['s-cn']).toBe(true);
    expect(cmpCHost['s-cr']).toBe(cmpCContentRef);
    expect(cmpCHost['s-cr']['s-hn']).toBeUndefined();

    const cmpCLightDomText = cmpCContentRef.nextSibling as d.RenderNode;
    expect(cmpCLightDomText.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpCLightDomText.textContent.trim()).toBe('cmp-c light-dom');
    expect(cmpCLightDomText['s-ol']).toBeUndefined();

    const cmpCFooter = cmpCLightDomText.nextSibling as d.RenderNode;
    expect(cmpCFooter.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpCFooter.nodeName).toBe('FOOTER');
    expect(cmpCFooter['s-hn']).toBe('cmp-c');

    const cmpCFooterText = cmpCFooter.firstChild as d.RenderNode;
    expect(cmpCFooterText.nodeType).toBe(NODE_TYPE.TextNode);
    expect(cmpCFooterText.textContent.trim()).toBe('cmp-c scope-encapsulated');
    expect(cmpCFooterText['s-hn']).toBe('cmp-c');

    const cmpASpan = cmpBHost.nextSibling.nextSibling as d.RenderNode;
    expect(cmpASpan.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(cmpASpan.nodeName).toBe('SPAN');
    expect(cmpASpan.textContent.trim()).toBe('cmp-a light-dom bottom');
    expect(cmpASpan['s-hn']).toBeUndefined();
    expect(cmpASpan['s-cr']).toBeUndefined();
    expect(cmpASpan['s-ol']).toBe(cmpAOrgLoc2);
    expect(cmpAOrgLoc2['s-nr']).toBe(cmpASpan);

    expect(hydratedRoot.innerHTML).toEqualHtml(`
      <cmp-a class="scs-cmp-a-h scs-cmp-a-s hydrated">
        <header class="scs-cmp-a">
          cmp-a scope-encapsulated
        </header>
        cmp-a light-dom top
        <cmp-b class="scs-cmp-b-h hydrated">
          <div class="scs-cmp-b scs-cmp-b-s">
            <article>
              cmp-b light-dom top
            </article>
            <section class="scs-cmp-b">
              cmp-b scope-encapsulated
            </section>
            <nav slot="named-slot">
              cmp-b light-dom bottom
            </nav>
            <cmp-c class="scs-cmp-b scs-cmp-c-h hydrated">
              cmp-c light-dom
              <footer class="scs-cmp-c">
                cmp-c scope-encapsulated
              </footer>
            </cmp-c>
          </div>
        </cmp-b>
        <span>
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
  } else if (a.vtag !== 'slot') {
    expect(b.elm.nodeType).toBe(NODE_TYPE.ElementNode);
  }
}
