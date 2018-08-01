import * as d from '../../../declarations';
import { compareHtml, mockConfig, mockDomApi, mockHtml, mockPlatform  } from '../../../testing/mocks';
import { createVNodesFromSsr } from '../hydrate-client-from-ssr';
import { ENCAPSULATION, SSR_CHILD_ID, SSR_SHADOW_DOM, SSR_VNODE_ID } from '../../../util/constants';
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
            return h('div', null,
              h('section', null, 'Shadow Content'),
              h('slot', null),
              h('slot', { name: 'named-slot' })
            );
          }
        } as any
      }
    };
    const opts: d.HydrateOptions = {
      html: `<cmp-a></cmp-a>`
    };

    const hydrateResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);

    expect(hydrateResults.diagnostics).toEqual([]);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head></head>
        <body>
          <cmp-a class="sc-cmp-a-h ${config.hydratedCssClass}" ssrsd="" ssrv="0">
            <div class="sc-cmp-a sc-cmp-a-s" ssrc="0.0">
              <section class="sc-cmp-a" ssrc="0.0">
                <!--s.0.0-->Shadow Content<!--/-->
              </section>
              <!--l.0.1.-->
              <!--l.0.2.named-slot-->
            </div>
          </cmp-a>
        </body>
      </html>
    `));

    const hydratedRoot = mockHtml('<div>' + hydrateResults.html + '</div>');
    const cmpAElm = hydratedRoot.querySelector('cmp-a') as d.HostElement;

    createVNodesFromSsr(plt, domApi, hydratedRoot);

    const cmpAVnode = plt.vnodeMap.get(cmpAElm);

    expect(cmpAVnode.vtag).toBe('cmp-a');
    expect(cmpAVnode.elm.getAttribute(SSR_VNODE_ID)).toBe('0');
    expect(cmpAVnode.elm.getAttribute(SSR_SHADOW_DOM)).toBe('');
    expect(cmpAVnode.elm.classList.contains('sc-cmp-a-h')).toBe(true);

    expect(cmpAVnode.vchildren).toHaveLength(1);
    expect(cmpAVnode.vchildren[0].vtag).toBe('div');
    expect(cmpAVnode.vchildren[0].elm.parentNode).toBe(cmpAVnode.elm);
    expect(cmpAVnode.vchildren[0].elm.classList.contains('sc-cmp-a')).toBe(true);
    expect(cmpAVnode.vchildren[0].elm.classList.contains('sc-cmp-a-s')).toBe(true);
    expect(cmpAVnode.vchildren[0].elm.getAttribute(SSR_CHILD_ID)).toBe('0.0');
    expect(cmpAVnode.vchildren[0].vattrs).toBe(undefined);

    expect(cmpAVnode.vchildren[0].vchildren).toHaveLength(3);

    expect(cmpAVnode.vchildren[0].vchildren[0].vtag).toBe('section');
    expect(cmpAVnode.vchildren[0].vchildren[0].elm.parentNode).toBe(cmpAVnode.vchildren[0].elm);
    expect(cmpAVnode.vchildren[0].vchildren[0].elm.classList.contains('sc-cmp-a')).toBe(true);
    expect(cmpAVnode.vchildren[0].vchildren[0].elm.getAttribute(SSR_CHILD_ID)).toBe('0.0');
    expect(cmpAVnode.vchildren[0].vchildren[0].vchildren).toHaveLength(1);

    expect(cmpAVnode.vchildren[0].vchildren[1].vtag).toBe('slot');
    expect(cmpAVnode.vchildren[0].vchildren[1].elm.parentNode).toBe(cmpAVnode.vchildren[0].elm);
    expect(cmpAVnode.vchildren[0].vchildren[1].elm.getAttribute('name')).toBe(null);
    expect(cmpAVnode.vchildren[0].vchildren[1].vname).toBe(undefined);
    expect(cmpAVnode.vchildren[0].vchildren[1].vattrs).toBe(undefined);

    expect(cmpAVnode.vchildren[0].vchildren[2].vtag).toBe('slot');
    expect(cmpAVnode.vchildren[0].vchildren[2].elm.parentNode).toBe(cmpAVnode.vchildren[0].elm);
    expect(cmpAVnode.vchildren[0].vchildren[2].vname).toBe('named-slot');
    expect(cmpAVnode.vchildren[0].vchildren[2].vattrs.name).toBe('named-slot');
    expect(cmpAVnode.vchildren[0].vchildren[2].elm.getAttribute('name')).toBe('named-slot');
  });

});
