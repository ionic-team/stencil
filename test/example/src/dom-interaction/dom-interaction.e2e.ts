import { newE2EPage } from '../../../../dist/testing';


describe('dom interaction e2e tests', () => {

  it('should click button in shadow root', async () => {
    const page = await newE2EPage({ html: `
      <dom-interaction></dom-api>
    `});

    const wasClicked = await page.find('dom-interaction >>> .was-clicked');

    expect(wasClicked).toEqualText(`false`);

    const button = await page.find('dom-interaction >>> button');

    await button.click();

    expect(wasClicked).toEqualText(`true`);
  });


  it('should focus button in shadow root', async () => {
    const page = await newE2EPage({ html: `
      <dom-interaction></dom-api>
    `});

    const wasFocused = await page.find('dom-interaction >>> .was-focused');

    expect(wasFocused).toEqualText(`false`);

    const button = await page.find('dom-interaction >>> button');

    await button.focus();

    expect(wasFocused).toEqualText(`true`);
  });

});
