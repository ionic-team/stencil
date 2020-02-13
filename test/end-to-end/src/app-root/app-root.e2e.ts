import { newE2EPage } from '@stencil/core/testing';


describe('goto root url', () => {

  it('should navigate to the index.html page w/out url searchParams', async () => {
    // create a new puppeteer page
    // and go to the root webpage
    const page = await newE2EPage({ url: '/' });

    // select the "prop-cmp" element within the page (same as querySelector)
    // and once it's received, then return the element's "textContent" property
    const elm = await page.find('prop-cmp >>> div');
    expect(elm).toEqualText('Hello, my name is Stencil JS');

    await page.compareScreenshot('navigate to homepage', {
      fullPage: false, clip: { x: 0, y: 0, width: 400, height: 250 }, omitBackground: true,
    });
  });

  it('should navigate to the index.html page with custom url searchParams', async () => {
    // create a new puppeteer page
    const page = await newE2EPage({
      url: '/?first=Doc&last=Brown'
    });

    const elm = await page.find('prop-cmp >>> div');
    expect(elm).toEqualText('Hello, my name is Doc Brown');

    await page.compareScreenshot('navigate to homepage with querystrings');
  });

  it('should apply global style when navigating to root page', async () => {
    const page = await newE2EPage({
      url: '/'
    });

    const elm = await page.find('app-root');
    const elmStyle = await elm.getComputedStyle();

    expect(elmStyle.borderColor).toBe('rgb(255, 0, 0)');
    expect(elmStyle.borderWidth).toBe('5px');
    expect(elmStyle.borderStyle).toBe('dotted');
  });

  it('should apply global style when setting html', async () => {
    const page = await newE2EPage({
      html: '<app-root></app-root>'
    });

    const elm = await page.find('app-root');
    const elmStyle = await elm.getComputedStyle();

    expect(elmStyle.borderColor).toBe('rgb(255, 0, 0)');
    expect(elmStyle.borderWidth).toBe('5px');
    expect(elmStyle.borderStyle).toBe('dotted');
  });

});
