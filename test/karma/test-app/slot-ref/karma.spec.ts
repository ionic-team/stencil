import { setupDomTests, waitForChanges } from '../util';

describe('slot-ref', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-ref/index.html');
  });
  afterEach(tearDownDom);

  it('ref callback is called', async () => {
    await waitForChanges();

    const host = app.querySelector('slot-ref');
    expect(host.getAttribute('data-ref')).toBe('called');
  });
});
