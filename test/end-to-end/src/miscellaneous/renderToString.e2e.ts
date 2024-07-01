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
      'selected.sc-car-list{font-weight:bold;background:rgb(255, 255, 210)}</style><link rel="stylesheet" href="whatever.css"> </head> <body>',
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
      '.selected.sc-scoped-car-list{font-weight:bold;background:rgb(255, 255, 210)}</style><style sty-id="sc-another-car-detail">/*!@section*/section.sc-another-car-detail{color:green}</style><link rel="stylesheet" href="whatever.css"> </head> <body> <div class="__next"> <main> <scoped-car-list',
    );
  });
});
