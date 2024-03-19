import { setupDomTests, waitForChanges } from '../util';

/**
 * Tests for the patched `removeChild()` method on `scoped` components.
 */
describe('remove-child-patch', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);

  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/remove-child-patch/index.html');
    host = app.querySelector('remove-child-patch');
  });

  afterEach(tearDownDom);

  it('should remove the last slotted node', async () => {
    expect(host).toBeDefined();

    const slotContainer = host.querySelector('.slot-container');
    expect(slotContainer).toBeDefined();
    const slottedSpans = slotContainer.querySelectorAll('span');
    expect(slottedSpans.length).toBe(2);

    document.querySelector('button').click();
    await waitForChanges();

    const slottedSpansAfter = slotContainer.querySelectorAll('span');
    expect(slottedSpansAfter.length).toBe(1);
  });

  it('should show slot-fb if the last slotted node is removed', async () => {
    expect(host).toBeDefined();

    const slotContainer = host.querySelector('.slot-container');
    expect(slotContainer).toBeDefined();
    const slottedSpans = slotContainer.querySelectorAll('span');
    expect(slottedSpans.length).toBe(2);

    const button = document.querySelector<HTMLButtonElement>('#remove-child-button');
    button.click();
    await waitForChanges();
    button.click();
    await waitForChanges();

    const slottedSpansAfter = slotContainer.querySelectorAll('span');
    expect(slottedSpansAfter.length).toBe(0);
    expect(slotContainer.textContent.trim()).toBe('Slot fallback content');
  });

  it('should still be able to remove nodes not slotted', async () => {
    expect(host).toBeDefined();

    expect(host.querySelector('div')).toBeDefined();

    const button = document.querySelector<HTMLButtonElement>('#remove-child-div-button');
    button.click();
    await waitForChanges();

    expect(host.querySelector('div')).toBeNull();
  });
});
