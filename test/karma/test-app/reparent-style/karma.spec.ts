import { setupDomTests, waitForChanges } from '../util';

describe('reparent behavior (style)', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/reparent-style/index.html');
  });
  afterEach(tearDownDom);

  it('should have styles applied by default', async () => {
    const varsContainer = app.querySelector('reparent-style-with-vars');
    const novarsContainer = app.querySelector('reparent-style-no-vars');

    expect(window.getComputedStyle(varsContainer).backgroundColor).toBe('rgb(0, 0, 255)');
    expect(window.getComputedStyle(novarsContainer).backgroundColor).toBe('rgb(0, 128, 128)');
  });

  it('should preserve styles after reparenting a component (no css vars)', async () => {
    const reparentButton: HTMLButtonElement = app.querySelector('.reparent-no-vars');
    reparentButton.click();
    await waitForChanges();
    const novars = app.querySelector('reparent-style-no-vars');
    expect(window.getComputedStyle(novars).backgroundColor).toBe('rgb(0, 128, 128)');
  });

  // This test fails in IE!
  it('should preserve styles after reparenting a component (with css vars)', async () => {
    const reparentButton: HTMLButtonElement = app.querySelector('.reparent-vars');
    reparentButton.click();
    await waitForChanges();

    const vars = app.querySelector('reparent-style-with-vars');
    expect(window.getComputedStyle(vars).backgroundColor).toBe('rgb(0, 0, 255)');
  });
});
