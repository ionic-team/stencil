import { setupDomTests } from '../util';

describe('static-styles', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/static-styles/index.html');
  });
  afterEach(tearDownDom);

  it('applies styles from static getter', async () => {
    const h1 = app.querySelector('h1');

    expect(window.getComputedStyle(h1).color).toBe('rgb(255, 0, 0)');
  });
});
