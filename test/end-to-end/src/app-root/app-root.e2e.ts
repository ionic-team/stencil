import { newE2EPage } from '../../../../dist/testing';


describe('goto root url', () => {

  it('should navigate to the index.html page w/out url searchParams', async () => {
    // create a new puppeteer page
    // and go to the root webpage
    const page = await newE2EPage({ url: '/'});

    // select the "prop-cmp" element within the page (same as querySelector)
    // and once it's received, then return the element's "textContent" property
    const elm = await page.find('prop-cmp >>> div');
    expect(elm).toEqualText('Hello, my name is Stencil JS');

    // await page.screenshot('navigate to homepage');
  });

  it('should navigate to the index.html page with custom url searchParams', async () => {
    // create a new puppeteer page
    const page = await newE2EPage({
      url: '/?first=Doc&last=Brown'
    });

    const elm = await page.find('prop-cmp >>> div');
    expect(elm).toEqualText('Hello, my name is Doc Brown');

    // await page.screenshot('navigate to homepage with querystrings');
  });

});
