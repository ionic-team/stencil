import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('shadow-dom-mode', () => {
  beforeEach(() => {
    render({
      template: () => (
        <>
          <shadow-dom-mode id="blue" colormode="blue"></shadow-dom-mode>
          <shadow-dom-mode id="red" colormode="red"></shadow-dom-mode>
        </>
      ),
    });
  });

  it('renders', async () => {
    await $('shadow-dom-mode[id="blue"]').waitForExist();

    const blueElm = document.querySelector('shadow-dom-mode[id="blue"]');
    const blueBg = window.getComputedStyle(blueElm).backgroundColor;
    expect(blueBg).toBe('rgb(0, 0, 255)');

    await $('shadow-dom-mode[id="red"]').waitForExist();

    const redElm = document.querySelector('shadow-dom-mode[id="red"]');
    const redBg = window.getComputedStyle(redElm).backgroundColor;
    expect(redBg).toBe('rgb(255, 0, 0)');
  });
});
