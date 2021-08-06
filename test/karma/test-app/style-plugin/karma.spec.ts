import { setupDomTests } from '../util';

describe('style-plugin', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/style-plugin/index.html');
  });
  afterEach(tearDownDom);

  it('sass-cmp', async () => {
    const sassHost = app.querySelector('sass-cmp');
    const shadowRoot = sassHost.shadowRoot;

    const sassEntry = shadowRoot.querySelector('.sass-entry');
    const sassImportee = shadowRoot.querySelector('.sass-importee');
    const cssImportee = shadowRoot.querySelector('.css-importee');
    const bootstrapBtn = shadowRoot.querySelector('.btn-primary');
    const hr = shadowRoot.querySelector('hr');

    expect(window.getComputedStyle(sassEntry).color).toBe('rgb(255, 0, 0)');
    expect(window.getComputedStyle(sassImportee).color).toBe('rgb(0, 128, 0)');
    expect(window.getComputedStyle(cssImportee).color).toBe('rgb(0, 0, 255)');
    expect(window.getComputedStyle(bootstrapBtn).color).toBe('rgb(255, 255, 255)');
    expect(window.getComputedStyle(hr).height).toBe('0px');
  });

  it('css-cmp', async () => {
    const cssHost = app.querySelector('css-cmp');
    const shadowRoot = cssHost.shadowRoot;

    const cssEntry = shadowRoot.querySelector('.css-entry');
    const cssImportee = shadowRoot.querySelector('.css-importee');
    const hr = shadowRoot.querySelector('hr');

    expect(window.getComputedStyle(cssEntry).color).toBe('rgb(128, 0, 128)');
    expect(window.getComputedStyle(cssImportee).color).toBe('rgb(0, 0, 255)');
    expect(window.getComputedStyle(hr).height).toBe('0px');
  });
});
