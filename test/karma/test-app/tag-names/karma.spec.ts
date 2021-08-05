import { setupDomTests } from '../util';

describe('tag-names', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/tag-names/index.html');
  });
  afterEach(tearDownDom);

  it('should load tags with numbers in them', async () => {
    const tag3d = app.querySelector('tag-3d-component');
    expect(tag3d.textContent.trim()).toBe('tag-3d-component');

    const tag88 = app.querySelector('tag-88');
    expect(tag88.textContent.trim()).toBe('tag-88');
  });
});
