import { setupDomTests, waitForChanges } from '../util';


fdescribe('es5-polyfills', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/es5-polyfills/index.html');
  });
  afterEach(tearDownDom);

  it('should load without issue', async () => {
    const cmp = app.querySelector('es5-polyfills') as any;
    await waitForChanges();
    expect(cmp).not.toBeUndefined();
  });
});
