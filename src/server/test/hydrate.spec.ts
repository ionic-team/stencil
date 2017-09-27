import { BuildConfig, BuildContext, ComponentRegistry, HydrateOptions, HydrateResults } from '../../util/interfaces';
import { hydrateHtml } from '../hydrate-html';
import { mockBuildConfig, compareHtml } from '../../testing/mocks';
import { h } from '../../core/renderer/h';
import { HAS_SLOTS, HAS_NAMED_SLOTS, SLOT_TAG, HYDRATED_CSS } from '../../util/constants';


describe('hydrate', () => {

  it('should load content in nested named slots', (done) => {
    const ctx: BuildContext = {};
    const hydrateResults: HydrateResults = {
      diagnostics: []
    };
    const registry: ComponentRegistry = {
      'ION-TEST': {
        componentModule: class {
          render() {
            return h('elm-a', 0, [
              h(SLOT_TAG, { a: { name: 'slot-a' }}),
              h(SLOT_TAG, 0),
              h(SLOT_TAG, { a: { name: 'slot-b' }})
            ]);
          }
        },
        slotMeta: HAS_NAMED_SLOTS
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

    hydrateHtml(config, ctx, registry, opts, hydrateResults, () => {
      expect(hydrateResults.diagnostics.length).toBe(0);

      expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
        <html dir="ltr">
          <head></head>
          <body>
            <ion-test data-ssrv="0" class="${HYDRATED_CSS}">
              <elm-a data-ssrc="0.0.">
                <div slot="slot-a">inner slot-a text</div>
                <div>default slot text</div>
                <div slot="slot-b">inner slot-b text</div>
              </elm-a>
            </ion-test>
          </body>
        </html>
      `));

      done();
    });
  });

  it('should load content in nested default slot', (done) => {
    const ctx: BuildContext = {};
    const hydrateResults: HydrateResults = {
      diagnostics: []
    };
    const registry: ComponentRegistry = {
      'ION-TEST': {
        componentModule: class {
          render() {
            return h('elm-a', 0, [
              'inner text',
              h(SLOT_TAG, 0)
            ]);
          }
        },
        slotMeta: HAS_SLOTS
      }
    };
    const opts: HydrateOptions = {
      html: `
        <ion-test>
          content text
        </ion-test>
      `
    };

    hydrateHtml(config, ctx, registry, opts, hydrateResults, () => {
      expect(hydrateResults.diagnostics.length).toBe(0);

      expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
        <html dir="ltr">
          <head></head>
          <body>
            <ion-test data-ssrv="0" class="${HYDRATED_CSS}">
              <elm-a data-ssrc="0.0">
                <!--s.0.0-->inner text<!--/-->
                content text
              </elm-a>
            </ion-test>
          </body>
        </html>
      `));

      done();
    });
  });

  it('should load one component and assign ssr ids', (done) => {
    const ctx: BuildContext = {};
    const hydrateResults: HydrateResults = {
      diagnostics: []
    };
    const registry: ComponentRegistry = {
      'ION-TEST': {
        componentModule: class {
          render() {
            return h('div', 0);
          }
        }
      }
    };
    const opts: HydrateOptions = {
      html: `<ion-test></ion-test>`
    };

    hydrateHtml(config, ctx, registry, opts, hydrateResults, () => {
      expect(hydrateResults.diagnostics.length).toBe(0);

      expect(compareHtml(hydrateResults.html)).toEqual(compareHtml(`
        <html dir="ltr">
          <head></head>
          <body>
            <ion-test data-ssrv="0" class="${HYDRATED_CSS}">
              <div data-ssrc="0.0."></div>
            </ion-test>
          </body>
        </html>
      `));

      done();
    });
  });

  it('should do nothing when no components registered', (done) => {
    const ctx: BuildContext = {};
    const hydrateResults: HydrateResults = {
      diagnostics: []
    };
    const registry: ComponentRegistry = {};
    const opts: HydrateOptions = {
      html: `<body>hello</body>`
    };

    hydrateHtml(config, ctx, registry, opts, hydrateResults, () => {
      expect(hydrateResults.diagnostics.length).toBe(1);
      expect(hydrateResults.html).toBe(`<body>hello</body>`);
      done();
    });
  });

  var config: BuildConfig = {};

  beforeEach(() => {
    config = mockBuildConfig();
  });

});


