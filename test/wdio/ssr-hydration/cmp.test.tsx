import { browser } from '@wdio/globals';
import { renderToString } from '../hydrate/index.mjs';
import { setupIFrameTest } from '../util.js';

describe('Sanity check SSR > Client hydration', () => {


  const testSuites = async (root: Document, method: 'scoped' | 'declarative-shadow-dom', renderType: 'dist' | 'custom-elements') => {
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
    
    async function getTxt(selector: string) {
      await browser.waitUntil(() => !!root.querySelector(selector), { timeout: 3000 });
      return root.querySelector(selector).textContent.trim();
    }

    function getTxtHtml(html: string, className: string) {
      const match = html.match(new RegExp(`<div class="${className}".*?>(.*?)</div>`, 'g'));
      if (match && match[0]) {
        const textMatch = match[0].match(new RegExp(`<div class="${className}".*?>(.*?)</div>`));
        return textMatch ? textMatch[1].replace(/<!--.*?-->/g, '').trim() : null;
      }
      return null;
    }
  
    return {
      preservesNodes: async () => {
        if (root.querySelector('#stage')) {
          root.querySelector('#stage')?.remove();
          await browser.waitUntil(async () => !root.querySelector('#stage'));
        }
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
            serializeShadowRoot: method,
            constrainTimeouts: false,
            prettyHTML: false,
          },
        );
        const stage = root.createElement('div');
        stage.setAttribute('id', 'stage');
        stage.setHTMLUnsafe(html);
        root.body.appendChild(stage);

        if (renderType === 'dist') {
          // @ts-expect-error resolved through WDIO
          const { defineCustomElements } = await import('/dist/loader/index.js');
          defineCustomElements().catch(console.error);
        }
    
        // // wait for Stencil to take over and reconcile
        await browser.waitUntil(async () => customElements.get('ssr-shadow-cmp'));
        expect(typeof customElements.get('ssr-shadow-cmp')).toBe('function');
    
        await expect(getNodeNames(root.querySelector('ssr-shadow-cmp').childNodes)).toBe(
          `text comment div comment text`,
        );

        const eles = method === 'scoped' ? 'div' : 'style div';
        await expect(getNodeNames(root.querySelector('ssr-shadow-cmp').shadowRoot.childNodes)).toBe(
          eles,
        );
      },
      // viaAttributes: async () => {
      //   root.setAttribute('decorated-prop', '200');
      //   root.setAttribute('decorated-getter-setter-prop', '-5');
      //   root.setAttribute('basic-prop', 'basicProp via attribute');
      //   root.setAttribute('basic-state', 'basicState via attribute');
      //   root.setAttribute('decorated-state', 'decoratedState via attribute');
  
      //   await browser.pause(100);
  
      //   expect(await getTxt('.basicProp')).toBe('basicProp via attribute');
      //   expect(await getTxt('.decoratedProp')).toBe('25');
      //   expect(await getTxt('.decoratedGetterSetterProp')).toBe('0');
      //   expect(await getTxt('.basicState')).toBe('basicState');
      //   expect(await getTxt('.decoratedState')).toBe('10');
      // },
    };
  };

  // describe('dist / declarative-shadow-dom', () => {
  //   let testSuite;
  //   beforeEach(async () => {
  //     testSuite = await testSuites(document, 'declarative-shadow-dom', 'dist');
  //   });
    
  //   it('verifies all nodes are preserved during hydration', async () => {
  //     await testSuite.preservesNodes();
  //   });
  // })

  // describe('dist / scoped', () => {
  //   let testSuite;
  //   beforeEach(async () => {
  //     testSuite = await testSuites(document, 'scoped', 'dist');
  //   });
    
  //   it('verifies all nodes are preserved during hydration', async () => {
  //     await testSuite.preservesNodes();
  //   });
  // });

  describe('custom-elements / declarative-shadow-dom', () => {
    let doc: Document;
    let testSuite;

    beforeEach(async () => {
      await setupIFrameTest('/ssr-hydration/custom-element.html', 'dsd-custom-elements');
      const frameEle: HTMLIFrameElement = document.querySelector('iframe#dsd-custom-elements');
      doc = frameEle.contentDocument;
      testSuite = await testSuites(doc, 'declarative-shadow-dom', 'custom-elements');
    });

    it('verifies all nodes are preserved during hydration', async () => {
      await testSuite.preservesNodes();
    });
  });

  

  

  // it('checks perf when loading lots of the same component', async () => {
  //   performance.mark('start-dsd');

  //   await renderToString(
  //     Array(50)
  //       .fill(0)
  //       .map((_, i) => `<ssr-shadow-cmp>Value ${i}</ssr-shadow-cmp>`)
  //       .join(''),
  //     {
  //       fullDocument: true,
  //       serializeShadowRoot: 'declarative-shadow-dom',
  //       constrainTimeouts: false,
  //     },
  //   );
  //   performance.mark('end-dsd');
  //   let renderTime = performance.measure('render', 'start-dsd', 'end-dsd').duration;
  //   await expect(renderTime).toBeLessThan(50);

  //   performance.mark('start-scoped');

  //   await renderToString(
  //     Array(50)
  //       .fill(0)
  //       .map((_, i) => `<ssr-shadow-cmp>Value ${i}</ssr-shadow-cmp>`)
  //       .join(''),
  //     {
  //       fullDocument: true,
  //       serializeShadowRoot: 'scoped',
  //       constrainTimeouts: false,
  //     },
  //   );
  //   performance.mark('end-scoped');
  //   renderTime = performance.measure('render', 'start-scoped', 'end-scoped').duration;
  //   await expect(renderTime).toBeLessThan(50);
  // });

  // it('resolves slots correctly during client-side hydration', async () => {
  //   if (!document.querySelector('#stage')) {
  //     const { html } = await renderToString(
  //       `
  //       <ssr-shadow-cmp>
  //         <p>Default slot content</p>
  //         <p slot="client-only">Client-only slot content</p>
  //       </ssr-shadow-cmp>
  //     `,
  //       {
  //         fullDocument: true,
  //         serializeShadowRoot: true,
  //         constrainTimeouts: false,
  //         prettyHTML: false,
  //       },
  //     );
  //     const stage = document.createElement('div');
  //     stage.setAttribute('id', 'stage');
  //     stage.setHTMLUnsafe(html);
  //     document.body.appendChild(stage);
  //   }

  //   // @ts-expect-error resolved through WDIO
  //   const { defineCustomElements } = await import('/dist/loader/index.js');
  //   defineCustomElements().catch(console.error);

  //   // wait for Stencil to take over and reconcile
  //   await browser.waitUntil(async () => customElements.get('ssr-shadow-cmp'));
  //   expect(typeof customElements.get('ssr-shadow-cmp')).toBe('function');

  //   await browser.waitUntil(async () => document.querySelector('ssr-shadow-cmp [slot="client-only"]'));
  //   await expect(document.querySelector('ssr-shadow-cmp').textContent).toBe(
  //     ' Default slot content Client-only slot content ',
  //   );

  //   document.querySelector('#stage')?.remove();
  // });
});
