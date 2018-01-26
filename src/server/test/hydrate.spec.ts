import { CompilerCtx, ComponentRegistry, Config, HydrateOptions, HydrateResults } from '../../util/interfaces';
import { hydrateHtml } from '../hydrate-html';
import { h } from '../../core/renderer/h';
import { compareHtml, mockConfig } from '../../testing/mocks';


describe('hydrate', () => {

  it('should load content in nested named slots', async () => {
    const ctx: CompilerCtx = {};
    const registry: ComponentRegistry = {
      'ion-test': {
        componentConstructor: class {
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
    const opts: HydrateOptions = {
      html: `
        <ion-test>
          <div>default slot text</div>
          <div slot="slot-b">inner slot-b text</div>
          <div slot="slot-a">inner slot-a text</div>
        </ion-test>
      `
    };

    const hydrateResults = await hydrateHtml(config, ctx, registry, opts);
    expect(hydrateResults.diagnostics.length).toBe(0);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head>
          <link rel="canonical" href="/">
        </head>
        <body>
          <ion-test data-ssrv="0" class="${config.hydratedCssClass}">
            <elm-a data-ssrc="0.0.">
              <div slot="slot-a">inner slot-a text</div>
              <div>default slot text</div>
              <div slot="slot-b">inner slot-b text</div>
            </elm-a>
          </ion-test>
        </body>
      </html>
    `));
  });

  it('should load content in nested default slot', async () => {
    const ctx: CompilerCtx = {};

    const registry: ComponentRegistry = {
      'ion-test': {
        componentConstructor: class {
          render() {
            return h('elm-a', null,
              'inner text',
              h('slot', null)
            );
          }
        } as any
      }
    };
    const opts: HydrateOptions = {
      html: `
        <ion-test>
          content text
        </ion-test>
      `
    };

    const hydrateResults = await hydrateHtml(config, ctx, registry, opts);

    expect(hydrateResults.diagnostics.length).toBe(0);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head>
          <link rel="canonical" href="/">
        </head>
        <body>
          <ion-test data-ssrv="0" class="${config.hydratedCssClass}">
            <elm-a data-ssrc="0.0">
              <!--s.0.0-->inner text<!--/-->
              content text
            </elm-a>
          </ion-test>
        </body>
      </html>
    `));
  });

  it('should load one component and assign ssr ids', async () => {
    const ctx: CompilerCtx = {};
    const registry: ComponentRegistry = {
      'ion-test': {
        componentConstructor: class {
          render() {
            return h('div', null);
          }
        } as any
      }
    };
    const opts: HydrateOptions = {
      html: `<ion-test></ion-test>`
    };

    const hydrateResults = await hydrateHtml(config, ctx, registry, opts);

    expect(hydrateResults.diagnostics.length).toBe(0);

    expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
      <html dir="ltr" data-ssr="">
        <head>
          <link rel="canonical" href="/">
        </head>
        <body>
          <ion-test data-ssrv="0" class="${config.hydratedCssClass}">
            <div data-ssrc="0.0."></div>
          </ion-test>
        </body>
      </html>
    `));
  });

  it('should do nothing when no components registered', async () => {
    const ctx: CompilerCtx = {};
    const registry: ComponentRegistry = {};
    const opts: HydrateOptions = {
      html: `<body>hello</body>`
    };

    const hydrateResults = await hydrateHtml(config, ctx, registry, opts);
    expect(hydrateResults.html).toBe(`<body>hello</body>`);
  });

  var config: Config;

  beforeEach(() => {
    config = mockConfig();
  });

});


