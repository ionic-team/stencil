import { setupDomTests } from '../util';


describe('shadow-dom-basic', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/shadow-dom-basic/index.html');
  });
  afterEach(tearDownDom);

  it('render', async () => {
    const result = app.querySelector('shadow-dom-basic-root');

    if ('attachShadow' in HTMLElement.prototype) {
      testNativeShadow(result);
    } else {
      testPolyfilledShadow(result);
    }
  });


  function testNativeShadow(elm: Element) {
    expect(elm.shadowRoot).toBeDefined();

    expect(elm.shadowRoot.children[0].nodeName).toBe('STYLE');

    expect(elm.shadowRoot.children[1].children[0].nodeName).toBe('DIV');
    expect(elm.shadowRoot.children[1].children[0].textContent.trim()).toBe('light');

    expect(elm.shadowRoot.children[1].nodeName).toBe('SHADOW-DOM-BASIC');
    expect(elm.shadowRoot.children[1].shadowRoot.children[0].nodeName).toBe('STYLE');
    expect(elm.shadowRoot.children[1].shadowRoot.children[1].nodeName).toBe('DIV');
    expect(elm.shadowRoot.children[1].shadowRoot.children[1].textContent.trim()).toBe('shadow');

    const shadowBG = window.getComputedStyle(elm.shadowRoot.children[1].shadowRoot.children[1]).backgroundColor;
    expect(shadowBG).toBe('rgb(0, 0, 0)');

    const lightBG = window.getComputedStyle(elm.shadowRoot.children[1].children[0]).backgroundColor;
    expect(lightBG).toBe('rgb(255, 255, 0)');
  }

  function testPolyfilledShadow(elm: Element) {
    expect(elm.shadowRoot).toBe(elm);

    expect(elm.hasAttribute('data-shadow-dom-basic-root-host')).toBe(true);

    expect(elm.children[0].nodeName).toBe('SHADOW-DOM-BASIC');
    expect(elm.children[0].hasAttribute('data-shadow-dom-basic-root')).toBe(true);
    expect(elm.children[0].hasAttribute('data-shadow-dom-basic-host')).toBe(true);
    expect(elm.children[0].hasAttribute('data-shadow-dom-basic-slot')).toBe(true);

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
