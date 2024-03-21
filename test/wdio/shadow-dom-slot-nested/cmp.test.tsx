import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

const CSS = `main {
  color: blue;
  font-weight: bold;
}`

describe('shadow-dom-slot-nested', () => {
  beforeEach(async () => {
    render({
      template: () => (
        <>
          <main>
            main content
            <shadow-dom-slot-nested-root></shadow-dom-slot-nested-root>
          </main>
          <style>{CSS}</style>
        </>
      ),
    });
  });

  it('renders children', async () => {
    const elm = $('main');
    await expect(elm.getCSSProperty('color')).toMatchInlineSnapshot(`
      {
        "parsed": {
          "alpha": 1,
          "hex": "#0000ff",
          "rgba": "rgba(0,0,255,1)",
          "type": "color",
        },
        "property": "color",
        "value": "rgba(0,0,255,1)",
      }
    `);

    const cmp = $('shadow-dom-slot-nested-root')
    const section = cmp.shadow$('section');
    await expect(section.getCSSProperty('color')).toMatchInlineSnapshot(`
      {
        "parsed": {
          "alpha": 1,
          "hex": "#008000",
          "rgba": "rgba(0,128,0,1)",
          "type": "color",
        },
        "property": "color",
        "value": "rgba(0,128,0,1)",
      }
    `)

    const article = cmp.shadow$('article');
    await expect(article.getCSSProperty('color')).toMatchInlineSnapshot(`
      {
        "parsed": {
          "alpha": 1,
          "hex": "#008000",
          "rgba": "rgba(0,128,0,1)",
          "type": "color",
        },
        "property": "color",
        "value": "rgba(0,128,0,1)",
      }
    `);

    const children = article.$$('*')
    await expect(children).toBeElementsArrayOfSize(3);

    const testShadowNested = async function (i: number) {
      const nestedElm = children[i];

      const header = nestedElm.shadow$('header');
      await expect(header).toHaveText('shadow dom: ' + i);
      await expect(header.getCSSProperty('color')).toMatchInlineSnapshot(`
        {
          "parsed": {
            "alpha": 1,
            "hex": "#ff0000",
            "rgba": "rgba(255,0,0,1)",
            "type": "color",
          },
          "property": "color",
          "value": "rgba(255,0,0,1)",
        }
      `)

      const footer = nestedElm.shadow$('footer');
      const footerSlot = footer.$('slot');
      await expect(children).toBeElementsArrayOfSize(3);
      await expect(footerSlot.$$('*')).toBeElementsArrayOfSize(0);
      await expect(footerSlot).toHaveText('');

      await expect(nestedElm).toHaveText(expect.stringContaining('light dom: ' + i));
      await expect(nestedElm.getCSSProperty('color')).toMatchInlineSnapshot(`
        {
          "parsed": {
            "alpha": 1,
            "hex": "#008000",
            "rgba": "rgba(0,128,0,1)",
            "type": "color",
          },
          "property": "color",
          "value": "rgba(0,128,0,1)",
        }
      `)
    };

    await testShadowNested(0);
    await testShadowNested(1);
    await testShadowNested(2);
  });
});
