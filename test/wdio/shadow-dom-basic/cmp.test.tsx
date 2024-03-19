import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('shadow-dom-basic', () => {
  beforeEach(() => {
    render({
      template: () => <shadow-dom-basic-root></shadow-dom-basic-root>,
    });
  });

  it('render', async () => {
    await $('shadow-dom-basic-root').waitForExist();
    const elm = document.querySelector('shadow-dom-basic-root');

    if ('attachShadow' in HTMLElement.prototype) {
      await testNativeShadow(elm);
    } else {
      await testPolyfilledShadow(elm);
    }
  });

  async function testNativeShadow(elm: Element) {
    await expect(elm.shadowRoot).toBeDefined();

    const shadowDomBasic = elm.shadowRoot.lastElementChild;
    const lightDiv = elm.shadowRoot.lastElementChild.children[0];

    await expect(lightDiv.nodeName).toBe('DIV');
    await expect(lightDiv.textContent.trim()).toBe('light');

    await expect(shadowDomBasic.nodeName).toBe('SHADOW-DOM-BASIC');
    const shadowDiv = shadowDomBasic.shadowRoot.lastElementChild.previousElementSibling;
    await expect(shadowDiv.nodeName).toBe('DIV');
    await expect(shadowDiv.textContent.trim()).toBe('shadow');

    const shadowBG = window.getComputedStyle(shadowDiv).backgroundColor;
    await expect(shadowBG).toBe('rgb(0, 0, 0)');

    const lightBG = window.getComputedStyle(shadowDomBasic.lastElementChild).backgroundColor;
    await expect(lightBG).toBe('rgb(255, 255, 0)');
  }

  async function testPolyfilledShadow(elm: Element) {
    await expect(elm.shadowRoot).toBe(elm);

    await expect(elm.classList.contains('sc-shadow-dom-basic-root-h')).toBe(true);

    await expect(elm.children[0].nodeName).toBe('SHADOW-DOM-BASIC');
    await expect(elm.children[0].classList.contains('sc-shadow-dom-basic-root')).toBe(true);
    await expect(elm.children[0].classList.contains('sc-shadow-dom-basic-h')).toBe(true);
    await expect(elm.children[0].classList.contains('sc-shadow-dom-basic-s')).toBe(true);

    await expect(elm.children[0].children[0].nodeName).toBe('DIV');
    await expect(elm.children[0].children[0].textContent.trim()).toBe('shadow');

    await expect(elm.children[0].children[1].nodeName).toBe('DIV');
    await expect(elm.children[0].children[1].textContent.trim()).toBe('light');

    const shadowBG = window.getComputedStyle(elm.children[0].children[0]).backgroundColor;
    await expect(shadowBG).toBe('rgb(0, 0, 0)');

    const lightBG = window.getComputedStyle(elm.children[0].children[1]).backgroundColor;
    await expect(lightBG).toBe('rgb(255, 255, 0)');
  }
});
