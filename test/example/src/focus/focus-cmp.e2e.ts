import { newE2EPage } from '../../../../dist/testing';

describe('@Element', () => {
  it('should let me see the active element', async () => {
    // create a new puppeteer page
    const page = await newE2EPage({
      html: `
      <focus-cmp focus-on-open="true"></focus-cmp>
    `
    });
    const elm = await page.find('focus-cmp button');
    const activeElement = await page.evaluateHandle(
      async () => document.activeElement
    );
    expect(elm).toEqual(activeElement);
  });
});
