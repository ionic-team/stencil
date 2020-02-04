import { setupDomTests } from '../util';

describe('slot array top', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-array-top/index.html');
  });
  afterEach(tearDownDom);

  it('renders slotted content in the right position for polyfilled elements', async () => {
    if (!('attachShadow' in HTMLElement.prototype)) {
      const elm = app.querySelector('slot-array-top');

      expect(elm.children[0].nodeName).toBe('SPAN');
      expect(elm.children[0].textContent.trim()).toBe('Content should be on top');
      expect(elm.children[1].nodeName).toBe('P');
      expect(elm.children[1].textContent.trim()).toBe('Slotted content should be on bottom');

      const hiddenCmp = elm.querySelector('[hidden]');
      expect(hiddenCmp).toBe(null);
    }
  });
});
