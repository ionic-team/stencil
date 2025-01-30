import { renderToString } from '../hydrate/index.mjs';

describe('ssr-shadow-cmp', () => {
  function getNodeNames(chidNodes: NodeListOf<ChildNode>) {
    return Array.from(chidNodes)
      .flatMap((node) => {
        if (node.nodeType === 3) {
          if (node.textContent?.trim()) {
            return 'text';
          } else {
            return [];
          }
        } else if (node.nodeType === 8) {
          return 'comment';
        } else {
          return node.nodeName.toLowerCase();
        }
      })
      .join(' ');
  }

  it('verifies all nodes are preserved during hydration', async () => {
    if (!document.querySelector('#stage')) {
      const { html } = await renderToString(
        `
        <ssr-shadow-cmp>
          A text node
          <!-- a comment -->
          <div>An element</div>
          <!-- another comment -->
          Another text node
        </ssr-shadow-cmp>
      `,
        {
          fullDocument: true,
          serializeShadowRoot: true,
          constrainTimeouts: false,
        },
      );
      const stage = document.createElement('div');
      stage.setAttribute('id', 'stage');
      stage.setHTMLUnsafe(html);
      document.body.appendChild(stage);
    }

    // @ts-expect-error resolved through WDIO
    const { defineCustomElements } = await import('/dist/loader/index.js');
    defineCustomElements().catch(console.error);

    // wait for Stencil to take over and reconcile
    await browser.waitUntil(async () => customElements.get('ssr-shadow-cmp'));
    expect(typeof customElements.get('ssr-shadow-cmp')).toBe('function');

    await expect(getNodeNames(document.querySelector('ssr-shadow-cmp').childNodes)).toBe(
      `text comment div comment text`,
    );

    document.querySelector('#stage')?.remove();
    await browser.waitUntil(async () => !document.querySelector('#stage'));
  });

  it('checks perf when loading lots of the same component', async () => {
    performance.mark('start');

    await renderToString(
      Array(50)
        .fill(0)
        .map((_, i) => `<ssr-shadow-cmp>Value ${i}</ssr-shadow-cmp>`)
        .join(''),
      {
        fullDocument: true,
        serializeShadowRoot: true,
        constrainTimeouts: false,
      },
    );
    performance.mark('end');
    const renderTime = performance.measure('render', 'start', 'end').duration;
    await expect(renderTime).toBeLessThan(50);
  });

  it('resolves slots correctly during client-side hydration', async () => {
    if (!document.querySelector('#stage')) {
      const { html } = await renderToString(
        `
        <ssr-shadow-cmp>
          <p>Default slot content</p>
          <p slot="client-only">Client-only slot content</p>
        </ssr-shadow-cmp>
      `,
        {
          fullDocument: true,
          serializeShadowRoot: true,
          constrainTimeouts: false,
        },
      );
      const stage = document.createElement('div');
      stage.setAttribute('id', 'stage');
      stage.setHTMLUnsafe(html);
      document.body.appendChild(stage);
    }

    // @ts-expect-error resolved through WDIO
    const { defineCustomElements } = await import('/dist/loader/index.js');
    defineCustomElements().catch(console.error);

    // wait for Stencil to take over and reconcile
    await browser.waitUntil(async () => customElements.get('ssr-shadow-cmp'));
    expect(typeof customElements.get('ssr-shadow-cmp')).toBe('function');

    await browser.waitUntil(async () => document.querySelector('ssr-shadow-cmp [slot="client-only"]'));
    await expect(document.querySelector('ssr-shadow-cmp').textContent).toBe(
      ' Default slot content Client-only slot content ',
    );

    document.querySelector('#stage')?.remove();
  });
});
