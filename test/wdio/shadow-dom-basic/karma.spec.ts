import { setupDomTests } from '../util';

describe('shadow-dom-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/shadow-dom-basic/index.html');
  });
  afterEach(tearDownDom);

  it('render', async () => {
    const elm = app.querySelector('shadow-dom-basic-root');

    if ('attachShadow' in HTMLElement.prototype) {
      testNativeShadow(elm);
    } else {
      testPolyfilledShadow(elm);
    }
  });

  function testNativeShadow(elm: Element) {
    expect(elm.shadowRoot).toBeDefined();

    const shadowDomBasic = elm.shadowRoot.lastElementChild;
    const lightDiv = elm.shadowRoot.lastElementChild.children[0];

    expect(lightDiv.nodeName).toBe('DIV');
    expect(lightDiv.textContent.trim()).toBe('light');

    expect(shadowDomBasic.nodeName).toBe('SHADOW-DOM-BASIC');
    const shadowDiv = shadowDomBasic.shadowRoot.lastElementChild.previousElementSibling;
    expect(shadowDiv.nodeName).toBe('DIV');
    expect(shadowDiv.textContent.trim()).toBe('shadow');

    const shadowBG = window.getComputedStyle(shadowDiv).backgroundColor;
    expect(shadowBG).toBe('rgb(0, 0, 0)');

    const lightBG = window.getComputedStyle(shadowDomBasic.lastElementChild).backgroundColor;
    expect(lightBG).toBe('rgb(255, 255, 0)');
  }

  function testPolyfilledShadow(elm: Element) {
    expect(elm.shadowRoot).toBe(elm);

    expect(elm.classList.contains('sc-shadow-dom-basic-root-h')).toBe(true);

    expect(elm.children[0].nodeName).toBe('SHADOW-DOM-BASIC');
    expect(elm.children[0].classList.contains('sc-shadow-dom-basic-root')).toBe(true);
    expect(elm.children[0].classList.contains('sc-shadow-dom-basic-h')).toBe(true);
    expect(elm.children[0].classList.contains('sc-shadow-dom-basic-s')).toBe(true);

    expect(elm.children[0].children[0].nodeName).toBe('DIV');
    expect(elm.children[0].children[0].textContent.trim()).toBe('shadow');

    expect(elm.children[0].children[1].nodeName).toBe('DIV');
    expect(elm.children[0].children[1].textContent.trim()).toBe('light');

    const shadowBG = window.getComputedStyle(elm.children[0].children[0]).backgroundColor;
    expect(shadowBG).toBe('rgb(0, 0, 0)');

    const lightBG = window.getComputedStyle(elm.children[0].children[1]).backgroundColor;
    expect(lightBG).toBe('rgb(255, 255, 0)');
  }
});
