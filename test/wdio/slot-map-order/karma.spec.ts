import { setupDomTests } from '../util';

describe('slot-map-order', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-map-order/index.html');
  });
  afterEach(tearDownDom);

  it('render', async () => {
    const result = app.querySelector('slot-map-order');

    expect((result.children[0].children[0] as HTMLInputElement).value).toBe('a');
    expect((result.children[1].children[0] as HTMLInputElement).value).toBe('b');
    expect((result.children[2].children[0] as HTMLInputElement).value).toBe('c');

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
