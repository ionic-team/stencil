import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('invisible-prehydration-false', () => {
  beforeEach(async () => {
    tearDownStylesScripts();

    render({
      template: () => <prehydrated-styles></prehydrated-styles>,
    });

    // await browser.debug();

    await $('prehydrated-styles').waitForExist();
  });

  it('the style element will not be placed in the head', async () => {
    // await expect(await $('prehydrated-styles').innerH()).toEqual('<div>prehydrated-styles</div>');
    expect(document.querySelector('prehydrated-styles').innerHTML).toEqual('<div>prehydrated-styles</div>');

    await expect($$('style[data-styles]')).toBeElementsArrayOfSize(0);
    // expect(document.head.querySelectorAll('style[data-styles]').length).toEqual(0);
  });
});

function tearDownStylesScripts(): void {
  document.head.querySelectorAll('style[data-styles]').forEach((e) => e.remove());

  // [
  //   '/build/testprehydratedfalsestyles.esm.js',
  //   '/build/testprehydratedfalsestyles.js',
  //   '/build/testapp.esm.js',
  //   '/build/testapp.js',
  // ].forEach((src) => {
  //   document.querySelectorAll(`script[src="${src}"]`).forEach((e) => e.remove());
  // });
}
