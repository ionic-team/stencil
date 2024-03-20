import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('watch native attributes', () => {
  beforeEach(() => {
    render({
      template: () => <watch-native-attributes aria-label="myStartingLabel"></watch-native-attributes>,
    });
  });

  it('triggers the callback for the watched attribute', async () => {
    await $('watch-native-attributes').waitForExist();

    const cmp = document.querySelector('watch-native-attributes');
    expect(cmp.innerText).toBe('Label: myStartingLabel\n\nCallback triggered: false');

    cmp.setAttribute('aria-label', 'myNewLabel');
    await browser.pause(100);

    expect(cmp.innerText).toBe('Label: myNewLabel\n\nCallback triggered: true');
  });
});
