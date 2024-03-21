import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('shadow-dom-slot-nested', () => {
  beforeEach(async () => {
    render({
      template: () => (
        <main>
          main content
          <shadow-dom-slot-nested-root></shadow-dom-slot-nested-root>
        </main>
      ),
    });
  });

  it('renders children', async () => {
    let elm = document.querySelector('main');
    expect(window.getComputedStyle(elm).color).toBe('rgb(0, 0, 255)');

    elm = document.querySelector('shadow-dom-slot-nested-root');
    expect(elm.shadowRoot).toBeDefined();

    if ('attachShadow' in HTMLElement.prototype) {
      expect(elm.shadowRoot.nodeType).toBe(11);

      const section = elm.shadowRoot.querySelector('section');
      expect(window.getComputedStyle(section).color).toBe('rgb(0, 128, 0)');

      const article = elm.shadowRoot.querySelector('article');
      expect(window.getComputedStyle(article).color).toBe('rgb(0, 128, 0)');

      expect(article.children.length).toBe(3);

      const testShadowNested = function (i: number) {
        const nestedElm = article.children[i];
        const shadowRoot = nestedElm.shadowRoot;

        const header = shadowRoot.querySelector('header');
        expect(header.textContent.trim()).toBe('shadow dom: ' + i);
        expect(window.getComputedStyle(header).color).toBe('rgb(255, 0, 0)');

        const footer = shadowRoot.querySelector('footer');
        const footerSlot = footer.firstElementChild;
        expect(footerSlot.nodeName.toLowerCase()).toBe('slot');
        expect(footerSlot.childNodes.length).toBe(0);
        expect(footerSlot.textContent.trim()).toBe('');

        expect(nestedElm.textContent.trim()).toBe('light dom: ' + i);
        expect(window.getComputedStyle(nestedElm).color).toBe('rgb(0, 128, 0)');
      };

      testShadowNested(0);
      testShadowNested(1);
      testShadowNested(2);
    } else {
      expect(elm.shadowRoot).toBe(elm);
      expect(elm.classList.contains('sc-shadow-dom-slot-nested-root-h')).toBe(true);

      const section = elm.querySelector('section');
      expect(section.classList.contains('sc-shadow-dom-slot-nested-root')).toBe(true);
      expect(section.textContent.trim()).toBe('shadow-dom-slot-nested');
      expect(window.getComputedStyle(section).color).toBe('rgb(0, 128, 0)');

      const article = elm.querySelector('article');
      expect(article.classList.contains('sc-shadow-dom-slot-nested-root')).toBe(true);
      expect(window.getComputedStyle(article).color).toBe('rgb(0, 128, 0)');

      expect(article.children.length).toBe(3);

      const testSlotPolyfillNested = function (i: number) {
        const nestedElm = article.children[i];
        expect(nestedElm.classList.contains('sc-shadow-dom-slot-nested-root')).toBe(true);
        expect(nestedElm.classList.contains('sc-shadow-dom-slot-nested-h')).toBe(true);

        const header = nestedElm.querySelector('header');
        expect(header.classList.contains('sc-shadow-dom-slot-nested')).toBe(true);
        expect(header.classList.contains('sc-shadow-dom-slot-nested-s')).toBe(false);
        expect(header.textContent.trim()).toBe('shadow dom: ' + i);
        expect(window.getComputedStyle(header).color).toBe('rgb(255, 0, 0)');

        const footer = nestedElm.querySelector('footer');
        expect(footer.classList.contains('sc-shadow-dom-slot-nested')).toBe(true);
        expect(footer.classList.contains('sc-shadow-dom-slot-nested-s')).toBe(true);
        expect(footer.textContent.trim()).toBe('light dom: ' + i);
        expect(window.getComputedStyle(footer).color).toBe('rgb(0, 128, 0)');
      };

      testSlotPolyfillNested(0);
      testSlotPolyfillNested(1);
      testSlotPolyfillNested(2);
    }
  });
});
