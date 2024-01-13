import { setupDomTests, waitForChanges } from '../util';

/**
 * Tests the cases where a node is slotted in from the root `index.html` file
 * and the slot's parent element dynamically changes (e.g. from `p` to `span`).
 */
describe('slot-parent-tag-change', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-parent-tag-change/index.html');
  });

  afterEach(tearDownDom);

  describe('direct slot', () => {
    it('should relocate the text node to the slot after the parent tag changes', async () => {
      const root = app.querySelector('#top-level');

      expect(root).not.toBeNull();
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('P');
      expect(root.children[0].textContent.trim()).toBe('Hello');

      app.querySelector<HTMLButtonElement>('#top-level-button').click();
      await waitForChanges();

      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('SPAN');
      expect(root.children[0].textContent.trim()).toBe('Hello');
    });
  });

  describe('nested slot', () => {
    it('should relocate the text node to the slot after the parent tag changes', async () => {
      const root = app.querySelector('slot-parent-tag-change-root slot-parent-tag-change');

      expect(root).not.toBeNull();
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('P');
      expect(root.children[0].textContent.trim()).toBe('World');

      app.querySelector<HTMLButtonElement>('#nested-button').click();
      await waitForChanges();

      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('SPAN');
      expect(root.children[0].textContent.trim()).toBe('World');
    });
  });
});
