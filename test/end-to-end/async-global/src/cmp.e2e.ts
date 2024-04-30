import { newE2EPage } from '@stencil/core/testing';

describe('wait for component to be rendered', () => {
  it('when content is set as newE2EPage parameter', async () => {
    const page = await newE2EPage({
      html: `<my-cmp></my-cmp>`,
    });
    const element = await page.find('my-cmp');
    expect(element.textContent).toBe('Hello World!');
    expect(await page.evaluate(() => globalThis.globalAsyncSetup)).toBe(true);
  });

  it('when using setContent method', async () => {
    const page = await newE2EPage();
    await page.setContent(`<my-cmp></my-cmp>`);
    const element = await page.find('my-cmp');
    expect(element.textContent).toBe('Hello World!');
    expect(await page.evaluate(() => globalThis.globalAsyncSetup)).toBe(true);
  });
});
