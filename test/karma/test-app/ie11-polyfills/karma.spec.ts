import { setupDomTests } from '../util';


describe('attribute-basic', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/ie11-polyfills/index.html');
  });
  afterEach(tearDownDom);

  it('should load polyfills', async () => {
    expect(app.querySelector('.fetch').textContent).toBe('true');
  });

});
