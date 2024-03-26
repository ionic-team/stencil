import { newE2EPage } from '@stencil/core/testing';

describe('goto root url', () => {
  it('have custom hydrate flags and css', async () => {
    // create a new puppeteer page
    const page = await newE2EPage({
      html: `
        <cmp-a></cmp-a>
      `,
    });

    const spanCmpA = await page.$('cmp-a >>> span');
    expect(await spanCmpA.evaluate((el) => el.textContent)).toBe('I am in component A');
    const spanCmpB = await page.$('cmp-a >>> cmp-b >>> span');
    expect(await spanCmpB.evaluate((el) => el.textContent)).toBe('I am in component B');
    const spanCmpC = await page.$('cmp-a >>> cmp-b >>> cmp-c >>> span');
    expect(await spanCmpC.evaluate((el) => el.textContent)).toBe('I am in component C');

    // we skip through the shadow dom
    const spanCmp = await page.$('cmp-a >>> cmp-c >>> span');
    expect(await spanCmp.evaluate((el) => el.textContent)).toBe('I am in component C');
  });
});
