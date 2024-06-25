import { Readable } from 'node:stream';

import { newE2EPage } from '@stencil/core/testing';

import { CarData } from '../car-list/car-data';

const vento = new CarData('VW', 'Vento', 2024);
const beetle = new CarData('VW', 'Beetle', 2023);

async function readableToString(readable: Readable) {
  return new Promise((resolve, reject) => {
    let data = '';

    readable.on('data', (chunk) => {
      data += chunk;
    });

    readable.on('end', () => {
      resolve(data);
    });

    readable.on('error', (err) => {
      reject(err);
    });
  });
}

// @ts-ignore may not be existing when project hasn't been built
type HydrateModule = typeof import('../../hydrate');
let renderToString: HydrateModule['renderToString'];
let streamToString: HydrateModule['streamToString'];

describe('renderToString', () => {
  beforeAll(async () => {
    // @ts-ignore may not be existing when project hasn't been built
    const mod = await import('../../hydrate');
    renderToString = mod.renderToString;
    streamToString = mod.streamToString;
  });

  it('can render a simple dom node', async () => {
    const { html } = await renderToString('<div>Hello World</div>');
    expect(html).toContain('<body><div>Hello World</div></body>');
  });

  it('can render a simple dom node (sync)', async () => {
    const input = '<div>Hello World</div>';
    const renderedHTML = '<body><div>Hello World</div></body>';
    const stream = renderToString(input, {}, true);
    expect(await readableToString(stream)).toContain(renderedHTML);
    expect(await readableToString(streamToString(input))).toContain(renderedHTML);
  });

  it('renders scoped component', async () => {
    const { html } = await renderToString('<another-car-detail></another-car-detail>', {
      serializeShadowRoot: true,
      fullDocument: false,
    });
    expect(html).toMatchSnapshot();
  });

  it('supports passing props to components', async () => {
    const { html } = await renderToString(
      '<another-car-detail car=\'{"year":2024, "make": "VW", "model": "Vento"}\'></another-car-detail>',
      {
        serializeShadowRoot: true,
        fullDocument: false,
      },
    );
    expect(html).toMatchSnapshot();
    expect(html).toContain('2024 VW Vento');
  });

  it('supports passing props to components with a simple object', async () => {
    const { html } = await renderToString(`<another-car-detail car=${JSON.stringify(vento)}></another-car-detail>`, {
      serializeShadowRoot: true,
      fullDocument: false,
    });
    expect(html).toMatchSnapshot();
    expect(html).toContain('2024 VW Vento');
  });

  it('does not fail if provided object is not a valid JSON', async () => {
    const { html } = await renderToString(
      `<another-car-detail car='{"year":2024, "make": "VW", "model": "Vento"'></another-car-detail>`,
      {
        serializeShadowRoot: true,
        fullDocument: false,
      },
    );
    expect(html).toContain('<section class="sc-another-car-detail" c-id="1.0.0.0"><!--t.1.1.1.0--> </section>');
  });

  it('supports styles for DSD', async () => {
    const { html } = await renderToString('<another-car-detail></another-car-detail>', {
      serializeShadowRoot: true,
      fullDocument: false,
    });
    expect(html).toContain('section.sc-another-car-detail{color:green}');
  });

  it('only returns the element if we render to DSD', async () => {
    const { html } = await renderToString('<div>Hello World</div>', {
      serializeShadowRoot: true,
      fullDocument: false,
    });
    expect(html).toBe('<div>Hello World</div>');
  });

  it('can render nested components', async () => {
    const { html } = await renderToString(
      `<another-car-list cars=${JSON.stringify([vento, beetle])}></another-car-list>`,
      {
        serializeShadowRoot: true,
        fullDocument: false,
      },
    );
    expect(html).toMatchSnapshot();
    expect(html).toContain('2024 VW Vento');
    expect(html).toContain('2023 VW Beetle');
  });

  it('can render a scoped component within a shadow component', async () => {
    const { html } = await renderToString(`<car-list cars=${JSON.stringify([vento, beetle])}></car-list>`, {
      serializeShadowRoot: true,
      fullDocument: false,
    });
    expect(html).toMatchSnapshot();
    expect(html).toContain(
      '<car-detail class=\"sc-car-list\" custom-hydrate-flag=\"\" c-id=\"1.2.2.0\" s-id=\"2\"><!--r.2--><section c-id=\"2.0.0.0\"><!--t.2.1.1.0-->2024 VW Vento</section></car-detail>',
    );
    expect(html).toContain(
      '<car-detail class=\"sc-car-list\" custom-hydrate-flag=\"\" c-id=\"1.4.2.0\" s-id=\"3\"><!--r.3--><section c-id=\"3.0.0.0\"><!--t.3.1.1.0-->2023 VW Beetle</section></car-detail>',
    );
  });

  it('can render a scoped component within a shadow component (sync)', async () => {
    const input = `<car-list cars=${JSON.stringify([vento, beetle])}></car-list>`;
    const expectedResults = [
      '<car-detail class=\"sc-car-list\" custom-hydrate-flag=\"\" c-id=\"1.2.2.0\" s-id=\"2\"><!--r.2--><section c-id=\"2.0.0.0\"><!--t.2.1.1.0-->2024 VW Vento</section></car-detail>',
      '<car-detail class=\"sc-car-list\" custom-hydrate-flag=\"\" c-id=\"1.4.2.0\" s-id=\"3\"><!--r.3--><section c-id=\"3.0.0.0\"><!--t.3.1.1.0-->2023 VW Beetle</section></car-detail>',
    ] as const;
    const opts = {
      serializeShadowRoot: true,
      fullDocument: false,
    };

    const resultRenderToString = await readableToString(renderToString(input, opts, true));
    expect(resultRenderToString).toContain(expectedResults[0]);
    expect(resultRenderToString).toContain(expectedResults[1]);

    const resultStreamToString = await readableToString(streamToString(input, opts));
    expect(resultStreamToString).toContain(expectedResults[0]);
    expect(resultStreamToString).toContain(expectedResults[1]);
  });

  it('can take over a server side rendered component and re-render it in the browser', async () => {
    const { html } = await renderToString('<cmp-dsd></cmp-dsd>', {
      serializeShadowRoot: true,
      fullDocument: false,
    });

    expect(html).toContain('Count me: 0!');
    const page = await newE2EPage({ html, url: 'https://stencil.com' });
    const button = await page.find('cmp-dsd >>> button');
    await button.click();
    expect(button).toEqualText('Count me: 1!');
  });

  it('can take over a server side rendered component and re-render it in the browser with applied prop', async () => {
    const { html } = await renderToString('<cmp-dsd initial-counter="42"></cmp-dsd>', {
      serializeShadowRoot: true,
      fullDocument: false,
    });

    expect(html).toContain('Count me: 42!');
    const page = await newE2EPage({ html, url: 'https://stencil.com' });
    const button = await page.find('cmp-dsd >>> button');
    await button.click();
    expect(button).toEqualText('Count me: 43!');
  });

  it('can render server side component when client sender renders differently', async () => {
    const { html } = await renderToString('<cmp-server-vs-client></cmp-server-vs-client>', {
      serializeShadowRoot: true,
      fullDocument: false,
    });

    expect(html).toContain('Server vs Client? Winner: Server');
    const page = await newE2EPage({ html, url: 'https://stencil.com' });
    const button = await page.find('cmp-server-vs-client');
    expect(button.shadowRoot.querySelector('div')).toEqualText('Server vs Client? Winner: Client');
  });
});
