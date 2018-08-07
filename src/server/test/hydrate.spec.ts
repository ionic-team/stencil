import * as d from '../../declarations';
import { compareHtml, mockConfig } from '../../testing/mocks';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { h } from '../../renderer/vdom/h';
import { hydrateHtml } from '../hydrate-html';


describe('hydrate', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetHydrate;

  beforeEach(() => {
    config = mockConfig();
    outputTarget = config.outputTargets[0] as d.OutputTargetHydrate;
  });

  it('should add scope attributes', async () => {
    const ctx: d.CompilerCtx = {};
    const registry: d.ComponentRegistry = {
      'ion-test': {
        bundleIds: 'ion-test',
        tagNameMeta: 'ion-test',
        encapsulationMeta: ENCAPSULATION.ScopedCss,
        componentConstructor: class {
          static get encapsulation() {
            return 'scoped';
          }
          static get is() {
            return 'ion-test';
          }
          static get style() {
            return `
              .scs-ion-test-h {
                color: red;
              }
            `;
          }
          render() {
            return h('div', null);
          }
        } as any
      }
    };
    const opts: d.HydrateOptions = {
      html: `<ion-test></ion-test>`
    };

    const hydrateResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);

    expect(hydrateResults.diagnostics).toEqual([]);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head>
          <style data-styles="" data-ssr="ion-test">
            .scs-ion-test-h {
              color: red;
            }
          </style>
        </head>
        <body>
          <ion-test ssrh="0" class="scs-ion-test-h hydrated">
            <!--c.0-->
            <div class="scs-ion-test" ssrc="0.0."></div>
          </ion-test>
        </body>
      </html>
    `));
  });

  it('should load content in nested named slots', async () => {
    const ctx: d.CompilerCtx = {};
    const registry: d.ComponentRegistry = {
      'ion-test': {
        bundleIds: 'ion-test',
        tagNameMeta: 'ion-test',
        membersMeta: {
          size: {
            memberType: MEMBER_TYPE.Prop,
            propType: PROP_TYPE.String,
            attribName: 'size'
          }
        },
        componentConstructor: class {
          static get is() {
            return 'ion-test';
          }
          static get properties() {
            return {
              size: {
                type: String,
                attr: 'size'
              }
            };
          }
          render() {
            return h('elm-a', null,
              h('slot', { name: 'slot-a' }),
              h('slot', null),
              h('slot', { name: 'slot-b' })
            );
          }
        } as any
      }
    };
    const opts: d.HydrateOptions = {
      html: `
        <ion-test>
          <div>default slot text</div>
          <div slot="slot-b">inner slot-b text</div>
          <div slot="slot-a">inner slot-a text</div>
        </ion-test>
      `
    };

    const hydrateResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);
    expect(hydrateResults.diagnostics).toEqual([]);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head></head>
        <body>
          <ion-test ssrh="0" class="${config.hydratedCssClass}">
            <!--c.0-->
            <elm-a ssrc="0.0.">
              <!--s.0.0.slot-a--><div slot="slot-a" ssrl="0.6">inner slot-a text</div>
              <!--s.0.1--><div ssrl="0.2">default slot text</div>
              <!--s.0.2.slot-b--><div slot="slot-b" ssrl="0.4">inner slot-b text</div>
            </elm-a>
          </ion-test>
        </body>
      </html>
    `));
  });

  it('should load content in nested default slot', async () => {
    const ctx: d.CompilerCtx = {};

    const registry: d.ComponentRegistry = {
      'ion-test': {
        bundleIds: 'ion-test',
        tagNameMeta: 'ion-test',
        membersMeta: {
          size: {
            memberType: MEMBER_TYPE.Prop,
            propType: PROP_TYPE.String,
            attribName: 'size'
          }
        },
        componentConstructor: class {
          static get is() {
            return 'ion-test';
          }
          static get properties() {
            return {
              size: {
                type: String,
                attr: 'size'
              }
            };
          }
          render() {
            return h('elm-a', null,
              'component content',
              h('slot', null)
            );
          }
        } as any
      }
    };
    const opts: d.HydrateOptions = {
      html: `
        <ion-test>
          light-dom content
        </ion-test>
      `
    };

    const hydrateResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);

    expect(hydrateResults.diagnostics).toEqual([]);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head></head>
        <body>
          <ion-test ssrh="0" class="${config.hydratedCssClass}">
            <!--c.0-->
            <elm-a ssrc="0.0">
              <!--t.0.0-->component content<!--/-->
              <!--s.0.1--><!--l.0.1-->light-dom content
            </elm-a>
          </ion-test>
        </body>
      </html>
    `));
  });

  it('should load one component and assign ssr ids', async () => {
    const ctx: d.CompilerCtx = {};
    const registry: d.ComponentRegistry = {
      'ion-test': {
        bundleIds: 'ion-test',
        tagNameMeta: 'ion-test',
        membersMeta: {
          size: {
            memberType: MEMBER_TYPE.Prop,
            propType: PROP_TYPE.String,
            attribName: 'size'
          }
        },
        componentConstructor: class {
          static get is() {
            return 'ion-test';
          }
          static get properties() {
            return {
              size: {
                type: String,
                attr: 'size'
              }
            };
          }
          render() {
            return h('div', null);
          }
        } as any
      }
    };
    const opts: d.HydrateOptions = {
      html: `<ion-test></ion-test>`
    };

    const hydrateResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);

    expect(hydrateResults.diagnostics).toEqual([]);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head></head>
        <body>
          <ion-test ssrh="0" class="hydrated">
            <!--c.0-->
            <div ssrc="0.0."></div>
          </ion-test>
        </body>
      </html>
    `));
  });

  it('should do nothing when no components registered', async () => {
    const ctx: d.CompilerCtx = {};
    const registry: d.ComponentRegistry = {};
    const opts: d.HydrateOptions = {
      html: `<body>hello</body>`
    };

    const hydrateResults = await hydrateHtml(config, ctx, outputTarget, registry, opts);
    expect(hydrateResults.diagnostics).toEqual([]);
    expect(hydrateResults.html).toBe(`<body>hello</body>`);
  });

});
