import { CarData } from '../car-list/car-data';

const vento = new CarData('VW', 'Vento', 2024);
const beetle = new CarData('VW', 'Beetle', 2023);

// @ts-ignore may not be existing when project hasn't been built
type HydrateModule = typeof import('../../hydrate');
let renderToString: HydrateModule['renderToString'];

describe('renderToString', () => {
  beforeAll(async () => {
    // @ts-ignore may not be existing when project hasn't been built
    const mod = await import('../../hydrate');
    renderToString = mod.renderToString;
  });

  it('allows to hydrate whole HTML page', async () => {
    const { html } = await renderToString(
      `<html>
      <head>
        <link rel="stylesheet" href="whatever.css" >
      </head>

      <body>
        <div class="__next">
          <main>
            <car-list cars=${JSON.stringify([vento, beetle])}></car-list>
          </main>
        </div>

        <script type="module">
            import { defineCustomElements } from "./static/loader/index.js";
            defineCustomElements().catch(console.error);
        </script>
      </body>
      </html>`,
      { fullDocument: true, serializeShadowRoot: false },
    );

    /**
     * starts with a DocType and HTML tag
     */
    expect(html.startsWith('<!doctype html><html ')).toBeTruthy();
    /**
     * renders hydration styles and custom link tag within the head tag
     */
    expect(html).toContain(
      '}</style> <link rel="stylesheet" href="whatever.css"> </head> <body> <div class="__next"> <main> <car-list',
    );
  });

  it('puts style last in the head tag', async () => {
    const { html } = await renderToString(
      `<html>
      <head>
        <link rel="preconnect" href="https://some-url.com" />
      </head>

      <body>
        <div class="__next">
          <main>
            <scoped-car-list cars=${JSON.stringify([vento, beetle])}></scoped-car-list>
          </main>
        </div>

        <script type="module">
            import { defineCustomElements } from "./static/loader/index.js";
            defineCustomElements().catch(console.error);
        </script>
      </body>
      </html>`,
      { fullDocument: true, serializeShadowRoot: false },
    );

    expect(html).toContain(
      '<link rel="preconnect" href="https://some-url.com"> <style sty-id="sc-scoped-car-list">.sc-scoped-car-list-h{',
    );
    expect(html).toContain(
      '.selected.sc-scoped-car-list{font-weight:bold;background:rgb(255, 255, 210)}</style></head> <body> <div class="__next"> <main> <scoped-car-list cars',
    );
  });

  it('allows to hydrate whole HTML page with using a scoped component', async () => {
    const { html } = await renderToString(
      `<html>
      <head>
        <link rel="stylesheet" href="whatever.css" >
      </head>

      <body>
        <div class="__next">
          <main>
            <scoped-car-list cars=${JSON.stringify([vento, beetle])}></scoped-car-list>
          </main>
        </div>

        <script type="module">
            import { defineCustomElements } from "./static/loader/index.js";
            defineCustomElements().catch(console.error);
        </script>
      </body>
      </html>`,
      { fullDocument: true, serializeShadowRoot: false },
    );
    /**
     * starts with a DocType and HTML tag
     */
    expect(html.startsWith('<!doctype html><html ')).toBeTruthy();
    /**
     * renders hydration styles and custom link tag within the head tag
     */
    expect(html).toContain(
      '<link rel="stylesheet" href="whatever.css"> <style sty-id="sc-scoped-car-list">.sc-scoped-car-list-h{display:block;margin:10px;padding:10px;border:1px solid blue}ul.sc-scoped-car-list{display:block;margin:0;padding:0}li.sc-scoped-car-list{list-style:none;margin:0;padding:20px}.selected.sc-scoped-car-list{font-weight:bold;background:rgb(255, 255, 210)}</style></head> <body> <div class="__next"> <main> <scoped-car-list cars=',
    );
  });
});
