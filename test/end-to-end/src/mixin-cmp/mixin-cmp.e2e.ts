import { newE2EPage, E2EPage } from '@stencil/core/testing';

describe('@Mixin', () => {

  let page: E2EPage;
  beforeEach(async () => {
    // example showing how new test pages can be
    // created within beforeEach(), then using
    // page.setTestContent() or page.gotoTest()
    page = await newE2EPage();
  });

  it('should mixin properties', async () => {
    // create a new puppeteer page
    // load the page with html content
    await page.setContent(`
      <mixin-cmp></mixin-cmp>
    `);

    // we just made a change and now the async queue need to process it
    // make sure the queue does its work before we continue
    await page.waitForChanges();

    // select the "mixin-cmp" element within the page (same as querySelector)
    const elm = await page.find('mixin-cmp >>> div');
    expect(elm).toEqualText('Johnny B Good');
  });

  it('should mixin methods', async () => {
    const page = await newE2EPage({ html: `
      <mixin-cmp></mixin-cmp>
    `});

    const elm = await page.find('mixin-cmp');
    const methodRtnValue = await elm.callMethod('surnameWithTitle');

    expect(methodRtnValue).toBe('Mr Good');
  });

});
