import { setupDomTests, waitForChanges } from '../util';


describe('stencil-sibling', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/stencil-sibling/index.html');
  });
  afterEach(tearDownDom);

  it('loads sibling root', async () => {
    const elm = app.querySelector('stencil-sibling');

    expect(elm.textContent.trim()).toBe('sibling-shadow-domsibling-light-dom');
  });

});
