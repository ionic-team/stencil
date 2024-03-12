import { setupDomTests, waitForChanges } from '../util';

describe('slot-ref', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-ref/index.html');
  });
  afterEach(tearDownDom);

  it('ref callback of slot is called', async () => {
    await waitForChanges();

    const host = app.querySelector('slot-ref');
    expect(host.getAttribute('data-ref-id')).toBe('slotted-element-id');
    expect(host.getAttribute('data-ref-tagname')).toBe('SPAN');
  });
});
