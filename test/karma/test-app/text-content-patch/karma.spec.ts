import { setupDomTests } from '../util';

describe('textContent patch', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/text-content-patch/index.html');
  });
  afterEach(tearDownDom);

  describe('scoped encapsulation', () => {
    it('should return the content of the default slot', () => {
      const elm = app.querySelector('text-content-patch-scoped-with-slot');
      expect(elm.textContent.trim()).toBe('Slot content');
    });

    it('should set the content of the default slot', () => {
      const elm = app.querySelector('text-content-patch-scoped-with-slot');
      elm.textContent = 'New slot content';

      expect(elm.textContent.trim()).toBe('New slot content');
    });

    it('should return the content of all child nodes', () => {
      const elm = app.querySelector('text-content-patch-scoped');
      expect(elm.textContent.trim()).toBe('Top contentBottom content');
    });

    it('should replace all child nodes with a single text node', () => {
      const elm = app.querySelector('text-content-patch-scoped');
      elm.textContent = 'New content';

      expect(elm.textContent.trim()).toBe('New content');
    });
  });

  describe('no encapsulation', () => {
    it('should return the content of the default slot', () => {
      const elm = app.querySelector('text-content-patch-with-slot');
      expect(elm.textContent.trim()).toBe('Slot content');
    });

    it('should set the content of the default slot', () => {
      const elm = app.querySelector('text-content-patch-with-slot');
      elm.textContent = 'New slot content';

      expect(elm.textContent.trim()).toBe('New slot content');
    });

    it('should return the content of all child nodes', () => {
      const elm = app.querySelector('text-content-patch');
      expect(elm.textContent.trim()).toBe('Top contentBottom content');
    });

    it('should replace all child nodes with a single text node', () => {
      const elm = app.querySelector('text-content-patch');
      elm.textContent = 'New content';

      expect(elm.textContent.trim()).toBe('New content');
    });
  });
});
