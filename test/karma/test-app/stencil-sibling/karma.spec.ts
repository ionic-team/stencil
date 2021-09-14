import { setupDomTests } from '../util';

describe('stencil-sibling', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/stencil-sibling/index.html');
  });
  afterEach(tearDownDom);

  it('loads sibling root', async () => {
    const stencilSibling = app.querySelector('stencil-sibling');
    expect(stencilSibling).toBeDefined();

    const siblingRoot = stencilSibling.querySelector('sibling-root');
    expect(siblingRoot).toBeDefined();

    const section = siblingRoot.querySelector('div section');
    expect(section.textContent.trim()).toBe('sibling-shadow-dom');

    const article = section.nextElementSibling;
    expect(article.textContent.trim()).toBe('sibling-light-dom');
  });
});
