import { newE2EPage } from '@stencil/core/testing';

describe('Querying non-existent element(s)', () => {
  it('returns `null` if the element does not exist', async () => {
    // create a new puppeteer page
    const page = await newE2EPage({
      html: `
        <empty-cmp></empty-cmp>
      `,
    });

    const elm = await page.find('empty-cmp >>> .non-existent');
    expect(elm).toBeNull();
  });

  it('returns an empty array if no elements match the selector', async () => {
    // create a new puppeteer page
    const page = await newE2EPage({
      html: `
        <empty-cmp></empty-cmp>
      `,
    });

    const elm = await page.findAll('empty-cmp >>> .non-existent');
    expect(elm).toEqual([]);
  });
});
