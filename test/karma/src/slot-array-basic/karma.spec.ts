import { setupDomTests } from '../util';

describe('slot array basic', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-array-basic/index.html');
  });
  afterEach(tearDownDom);

  it('renders slotted content in the right position for polyfilled elements', async () => {
    if (!('attachShadow' in HTMLElement.prototype)) {
      const elm = app.querySelector('slot-array-basic');
      expect(elm.children[0].classList).toContain('first');
      expect(elm.children[0].textContent.trim()).toBe('first');

      expect(elm.children[1].classList).toBe('middle');

      expect(elm.children[2].classList).toContain('last');
    }
  });
});
