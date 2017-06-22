import { ComponentRegistry, HydrateOptions } from '../../../util/interfaces';
import { hydrateHtml } from '../hydrate-html';
import { mockStencilSystem, compareHtml } from '../../../test';
import { h } from '../../renderer/h';
import { SLOT_TAG, HAS_SLOTS, HAS_NAMED_SLOTS } from '../../../util/constants';


describe('hydrate', () => {

  it('should load content in nested named slots', (done) => {
    const registry: ComponentRegistry = {
      'ion-test': {
        componentModuleMeta: class {
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

    hydrateHtml(sys, staticDir, registry, opts, (err, html) => {
      expect(err).toBe(null);

      expect(compareHtml(html)).toEqual(compareHtml(`
        <html dir="ltr">
          <head></head>
          <body>
            <ion-test ssrid="0" class="hydrated">
              <elm-a ssrid="0">
                <!--s:slot-a-->
                  <div slot="slot-a">inner slot-a text</div>
                <!--/s-->
                <!--s:-->
                  <div>default slot text</div>
                <!--/s-->
                <!--s:slot-b-->
                  <div slot="slot-b">inner slot-b text</div>
                <!--/s-->
              </elm-a>
            </ion-test>
          </body>
        </html>
      `));

      done();
    });
  });

  it('should load content in nested default slot', (done) => {
    const registry: ComponentRegistry = {
      'ion-test': {
        componentModuleMeta: class {
          render() {
            return h('elm-a', 0, [
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
          inner text
        </ion-test>
      `
    };

    hydrateHtml(sys, staticDir, registry, opts, (err, html) => {
      expect(err).toBe(null);

      expect(compareHtml(html)).toEqual(compareHtml(`
        <html dir="ltr">
          <head></head>
          <body>
            <ion-test ssrid="0" class="hydrated">
              <elm-a ssrid="0">
                <!--s:-->
                inner text
                <!--/s-->
              </elm-a>
            </ion-test>
          </body>
        </html>
      `));

      done();
    });
  });

  it('should load content in default slot', (done) => {
    const registry: ComponentRegistry = {
      'ion-test': {
        componentModuleMeta: class {
          render() {
            return h(SLOT_TAG, 0);
          }
        },
        slotMeta: HAS_SLOTS
      }
    };
    const opts: HydrateOptions = {
      html: `
        <ion-test>
          inner text
        </ion-test>
      `
    };

    hydrateHtml(sys, staticDir, registry, opts, (err, html) => {
      expect(err).toBe(null);

      expect(compareHtml(html)).toEqual(compareHtml(`
        <html dir="ltr">
          <head></head>
          <body>
            <ion-test ssrid="0" class="hydrated">
              <!--s:-->
                inner text
              <!--/s-->
            </ion-test>
          </body>
        </html>
      `));

      done();
    });
  });

  it('should load one component and assign ssr ids', (done) => {
    const registry: ComponentRegistry = {
      'ion-test': {
        componentModuleMeta: class {
          render() {
            return h('div', 0);
          }
        }
      }
    };
    const opts: HydrateOptions = {
      html: `<ion-test></ion-test>`
    };

    hydrateHtml(sys, staticDir, registry, opts, (err, html) => {
      expect(err).toBe(null);

      expect(compareHtml(html)).toEqual(compareHtml(`
        <html dir="ltr">
          <head></head>
          <body>
            <ion-test ssrid="0" class="hydrated">
              <div ssrid="0"></div>
            </ion-test>
          </body>
        </html>
      `));

      done();
    });
  });

  it('should do nothing when no components registered', (done) => {
    const registry: ComponentRegistry = {};
    const opts: HydrateOptions = {
      html: `<body>hello</body>`
    };

    hydrateHtml(sys, staticDir, registry, opts, (err, html) => {
      expect(err).toBe(null);
      expect(html).toBe(`<body>hello</body>`);
      done();
    });
  });

  var staticDir = '/';
  var sys = mockStencilSystem();
});


