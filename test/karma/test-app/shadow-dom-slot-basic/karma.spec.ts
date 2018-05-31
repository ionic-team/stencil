import { setupDomTests } from '../util';

describe('shadow-dom-slot-basic', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/shadow-dom-slot-basic/index.html');
  });
  afterEach(tearDownDom);

  it('renders shadowRoot', async () => {
    let elm = app.querySelector('shadow-dom-slot-basic');
    expect(elm.shadowRoot).toBeDefined();
    expect(window.getComputedStyle(elm).color).toBe('rgb(255, 0, 0)');

    if ('attachShadow' in HTMLElement.prototype) {
      expect(elm.shadowRoot).not.toBe(elm);
      expect(elm.shadowRoot.nodeType).toBe(11);
      expect(elm.shadowRoot.firstElementChild.nodeName.toLowerCase()).toBe('style')
      expect(elm.shadowRoot.firstElementChild.textContent).toContain(':host');
      expect(elm.shadowRoot.firstElementChild.textContent).toContain('red');

    } else {
      expect(elm.shadowRoot).toBe(elm);

    }
  });

});
