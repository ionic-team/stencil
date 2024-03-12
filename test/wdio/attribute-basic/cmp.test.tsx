import { setupDomTests, waitForChanges } from '../util';

describe('attribute-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/attribute-basic/index.html');
  });
  afterEach(tearDownDom);

  it('button click rerenders', async () => {
    expect(app.querySelector('.single').textContent).toBe('single');
    expect(app.querySelector('.multiWord').textContent).toBe('multiWord');
    expect(app.querySelector('.customAttr').textContent).toBe('my-custom-attr');
    expect(app.querySelector('.htmlForLabel').getAttribute('for')).toBe('a');

    const button = app.querySelector('button');
    button.click();

    await waitForChanges();

    expect(app.querySelector('.single').textContent).toBe('single-update');
    expect(app.querySelector('.multiWord').textContent).toBe('multiWord-update');
    expect(app.querySelector('.customAttr').textContent).toBe('my-custom-attr-update');
  });
});
