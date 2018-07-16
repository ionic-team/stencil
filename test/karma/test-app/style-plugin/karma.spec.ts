import { setupDomTests } from '../util';


describe('style-plugin', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/style-plugin/index.html');
  });
  afterEach(tearDownDom);

  it('sass-cmp', async () => {
    const sassEntry = app.querySelector('sass-cmp .sass-entry');
    const sassImportee = app.querySelector('sass-cmp .sass-importee');
    const cssImportee = app.querySelector('sass-cmp .css-importee');

    expect(window.getComputedStyle(sassEntry).color).toBe('rgb(255, 0, 0)');
    expect(window.getComputedStyle(sassImportee).color).toBe('rgb(0, 128, 0)');
    expect(window.getComputedStyle(cssImportee).color).toBe('rgb(0, 0, 255)');
  });

  it('css-cmp', async () => {
    const cssEntry = app.querySelector('css-cmp .css-entry');
    const cssImportee = app.querySelector('css-cmp .css-importee');

    expect(window.getComputedStyle(cssEntry).color).toBe('rgb(128, 0, 128)');
    expect(window.getComputedStyle(cssImportee).color).toBe('rgb(0, 0, 255)');
  });

});
