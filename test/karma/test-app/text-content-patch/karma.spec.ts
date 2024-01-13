import { setupDomTests } from '../util';

describe('textContent patch', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/text-content-patch/index.html');
  });
  afterEach(tearDownDom);

  describe('scoped encapsulation', () => {
    it('should return the content of all slots', () => {
      const elm = app.querySelector('text-content-patch-scoped-with-slot');
      expect(elm.textContent.trim()).toBe('Slot content Suffix content');
    });

    it('should return an empty string if there is no slotted content', () => {
      const elm = app.querySelector('text-content-patch-scoped');
      expect(elm.textContent.trim()).toBe('');
    });

    it('should overwrite the default slot content', () => {
      const elm = app.querySelector('text-content-patch-scoped-with-slot');
      elm.textContent = 'New slot content';

      expect(elm.textContent.trim()).toBe('New slot content');
    });

    it('should not insert the text node if there is no default slot', () => {
      const elm = app.querySelector('text-content-patch-scoped');
      elm.textContent = 'New slot content';

      expect(elm.textContent.trim()).toBe('');
    });
  });
});
