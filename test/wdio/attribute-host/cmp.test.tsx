import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

import { isSafari } from '../util.js';

describe('attribute-host', function () {
  before(async () => {
    render({
      template: () => <attribute-host></attribute-host>,
    });
  });

  it('add/remove attrs', async () => {
    await $('section').waitForExist();

    const elm = await $('section');
    const button = await $('button');

    await expect(elm).toHaveAttribute('content', 'attributes removed');
    await expect(elm).toHaveAttribute('bold', 'false');
    await expect(elm).not.toHaveAttribute('padding');
    await expect(elm).not.toHaveAttribute('margin');
    await expect(elm).not.toHaveAttribute('color');
    await expect(elm).not.toHaveAttribute('no-attr');

    await expect(elm).toHaveStyle({
      // get default border color from body element as it might differ between different OS
      'border-color': browser.isChromium
        ? 'rgba(0,0,0,1)'
        : getComputedStyle(document.body).borderColor.replaceAll(' ', ''),
      display: 'inline-block',
      'font-size': '16px',
    });

    // this tests CSS custom properties in inline style, but CSS var are
    // not supported natively in IE11, so let's skip the test
    const win = window as any;
    if (!isSafari() && win.CSS && win.CSS.supports && win.CSS.supports('--prop', 'value')) {
      await expect(elm).toHaveStyle({ '--css-var': '' });
    }

    await button.click();

    await expect(elm).toHaveStyle({
      'border-color': browser.isChromium ? 'rgba(0,0,0,1)' : 'rgb(0,0,0)',
      display: 'block',
      'font-size': '24px',
    });

    if (win.CSS && win.CSS.supports && win.CSS.supports('--prop', 'value')) {
      expect(document.querySelector('section')?.style.getPropertyValue('--css-var')).toEqual('12');
    }

    await expect($(elm)).toHaveAttribute('content', 'attributes added');
    await expect($(elm)).toHaveAttribute('padding', isSafari() ? 'true' : '');
    await expect($(elm)).toHaveAttribute('bold', 'true');
    await expect($(elm)).toHaveAttribute('margin', isSafari() ? 'true' : '');
    await expect($(elm)).toHaveAttribute('color', 'lime');
    await expect($(elm)).not.toHaveAttribute('no-attr');

    await button.click();

    await expect(elm).toHaveStyle({
      'border-color': browser.isChromium
        ? 'rgba(255,255,255,1)'
        : getComputedStyle(document.body).borderColor.replaceAll(' ', ''),
      display: 'inline-block',
      'font-size': '16px',
    });

    if (win.CSS && win.CSS.supports && win.CSS.supports('--prop', 'value')) {
      await expect(elm).not.toHaveElementProperty('--css-var');
    }

    await expect($(elm)).toHaveAttribute('content', 'attributes removed');
    await expect($(elm)).not.toHaveAttribute('padding');
    await expect($(elm)).toHaveAttribute('bold', 'false');
    await expect($(elm)).not.toHaveAttribute('margin');
    await expect($(elm)).not.toHaveAttribute('color');
    await expect($(elm)).not.toHaveAttribute('no-attr');

    await button.click();

    await expect(elm).toHaveStyle({
      'border-color': browser.isChromium ? 'rgba(0,0,0,1)' : 'rgb(0,0,0)',
      display: 'block',
      'font-size': '24px',
    });

    if (win.CSS && win.CSS.supports && win.CSS.supports('--prop', 'value')) {
      expect(document.querySelector('section')?.style.getPropertyValue('--css-var')).toEqual('12');
    }

    await expect($(elm)).toHaveAttribute('content', 'attributes added');
    await expect($(elm)).toHaveAttribute('padding', isSafari() ? 'true' : '');
    await expect($(elm)).toHaveAttribute('bold', 'true');
    await expect($(elm)).toHaveAttribute('margin', isSafari() ? 'true' : '');
    await expect($(elm)).toHaveAttribute('color', 'lime');
    await expect($(elm)).not.toHaveAttribute('no-attr');
  });

  after(() => {
    document.querySelector('#stage')?.remove();
  });
});
