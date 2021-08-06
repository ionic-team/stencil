import { setupDomTests } from '../util';

describe('slot-basic-order', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-basic-order/index.html');
  });
  afterEach(tearDownDom);

  it('render', async () => {
    let result = app.querySelector('slot-basic-order-root');
    expect(result.textContent).toEqual('abc');

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
