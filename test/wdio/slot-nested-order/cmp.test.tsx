import { setupDomTests } from '../util';

describe('slot-nested-order', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-nested-order/index.html');
  });
  afterEach(tearDownDom);

  it('correct nested order', async () => {
    const root = app.querySelector('slot-nested-order-parent');

    expect(root.textContent).toBe('123456');

    const hiddenCmp = root.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
