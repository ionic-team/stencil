import { setupDomTests } from '../util';

describe('build-data', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/build-data/index.html');
  });
  afterEach(tearDownDom);

  it('should have proper values', async () => {
    expect(app.querySelector('.is-dev').textContent).toBe('isDev: false');
    expect(app.querySelector('.is-browser').textContent).toBe('isBrowser: true');
    expect(app.querySelector('.is-testing').textContent).toBe('isTesting: false');
  });
});
