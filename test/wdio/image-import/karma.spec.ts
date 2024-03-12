import { setupDomTests } from '../util';

describe('svg attr', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/image-import/index.html');
  });
  afterEach(tearDownDom);

  it('adds and removes attribute', async () => {
    const img = app.querySelector('img');
    expect(img.src.startsWith('data:image/svg+xml;base64,PD94bW')).toBe(true);
  });
});
