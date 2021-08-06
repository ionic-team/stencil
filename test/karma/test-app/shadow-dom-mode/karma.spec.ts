import { setupDomTests } from '../util';

describe('shadow-dom-mode', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/shadow-dom-mode/index.html');
  });
  afterEach(tearDownDom);

  it('render', async () => {
    const blueElm = app.querySelector('shadow-dom-mode[id="blue"]');

    const blueBg = window.getComputedStyle(blueElm).backgroundColor;
    expect(blueBg).toBe('rgb(0, 0, 255)');

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const redElm = app.querySelector('shadow-dom-mode[id="red"]');
        const redBg = window.getComputedStyle(redElm).backgroundColor;
        expect(redBg).toBe('rgb(255, 0, 0)');
        resolve();
      }, 2000);
    });
  });
});
