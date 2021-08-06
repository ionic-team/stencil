import { setupDomTests, waitForChanges } from '../util';

describe('key-reorder', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/key-reorder/index.html');
  });
  afterEach(tearDownDom);

  it('uses same nodes after reorder', async () => {
    let item0 = app.querySelector('#item-0') as any;
    let item1 = app.querySelector('#item-1') as any;
    let item2 = app.querySelector('#item-2') as any;
    let item3 = app.querySelector('#item-3') as any;
    let item4 = app.querySelector('#item-4') as any;

    expect(item0.previousElementSibling).toBe(null);
    expect(item1.previousElementSibling).toBe(item0);
    expect(item2.previousElementSibling).toBe(item1);
    expect(item3.previousElementSibling).toBe(item2);
    expect(item4.previousElementSibling).toBe(item3);

    item0.__orgItem = 0;
    item1.__orgItem = 1;
    item2.__orgItem = 2;
    item3.__orgItem = 3;
    item4.__orgItem = 4;

    const button = app.querySelector('button');
    button.click();

    await waitForChanges();

    item0 = app.querySelector('#item-0') as any;
    item1 = app.querySelector('#item-1') as any;
    item2 = app.querySelector('#item-2') as any;
    item3 = app.querySelector('#item-3') as any;
    item4 = app.querySelector('#item-4') as any;

    expect(item0.previousElementSibling).toBe(item1);
    expect(item1.previousElementSibling).toBe(item2);
    expect(item2.previousElementSibling).toBe(item3);
    expect(item3.previousElementSibling).toBe(item4);
    expect(item4.previousElementSibling).toBe(null);
  });
});
