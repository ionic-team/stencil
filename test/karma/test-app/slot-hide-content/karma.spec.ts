import { setupDomTests, waitForChanges } from '../util';

/**
 * Tests for projected content to be hidden in a `scoped` component
 * when it has no destination slot.
 */
describe('slot-hide-content', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/slot-hide-content/index.html');
  });

  afterEach(tearDownDom);

  describe('scoped encapsulation', () => {
    it('should hide content when no slot is provided', async () => {
      host = app.querySelector('slot-hide-content-scoped');
      const slottedContent = host.querySelector('#slotted-1');

      expect(slottedContent).toBeDefined();
      expect(slottedContent.hasAttribute('hidden')).toBe(true);
      expect(slottedContent.parentElement.tagName).toContain('SLOT-HIDE-CONTENT-SCOPED');

      document.querySelector('button').click();
      await waitForChanges();

      expect(slottedContent.hasAttribute('hidden')).toBe(false);
      expect(slottedContent.parentElement.classList).toContain('slot-wrapper');
    });
  });

  describe('no encapsulation', () => {
    it('should not hide content when no slot is provided', async () => {
      host = app.querySelector('slot-hide-content-open');
      const slottedContent = host.querySelector('#slotted-2');

      expect(slottedContent).toBeDefined();
      expect(slottedContent.hasAttribute('hidden')).toBe(false);
      expect(slottedContent.parentElement.tagName).toContain('SLOT-HIDE-CONTENT-OPEN');

      document.querySelector('button').click();
      await waitForChanges();

      expect(slottedContent.hasAttribute('hidden')).toBe(false);
      expect(slottedContent.parentElement.classList).toContain('slot-wrapper');
    });
  });
});
