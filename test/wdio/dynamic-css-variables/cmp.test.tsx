import { setupDomTests, waitForChanges } from '../util';

describe('dynamic-css-variables', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/dynamic-css-variables/index.html');
  });
  afterEach(tearDownDom);

  it('should dynamically change the inline css variable', async () => {
    const win = window as any;

    if (win.CSS && win.CSS.supports && win.CSS.supports('--fake-var', 0)) {
      const header = app.querySelector('header');
      const headerStyles1 = window.getComputedStyle(header);
      expect(headerStyles1.color).toBe('rgb(0, 0, 255)');

      const button = app.querySelector('button');
      button.click();
      await waitForChanges();

      const headerStyles2 = window.getComputedStyle(header);
      expect(headerStyles2.color).toBe('rgb(255, 255, 255)');

      button.click();
      await waitForChanges();

      const headerStyles3 = window.getComputedStyle(header);
      expect(headerStyles3.color).toBe('rgb(0, 0, 255)');
    }
  });
});
