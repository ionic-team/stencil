import { setupDomTests, waitForChanges } from '../util';

describe('slot-scoped-list', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-scoped-list/index.html');
  });
  afterEach(tearDownDom);

  it('renders this list in correct slots', async () => {
    let button: HTMLButtonElement = app.querySelector('slot-list-light-scoped-root button');
    let list = app.querySelector('slot-dynamic-scoped-list');

    expect(button).toBeTruthy();
    expect(list).toBeTruthy();

    let items = list.querySelectorAll('.list-wrapper > div');
    expect(items.length).toEqual(0);

    button.click();
    await waitForChanges();

    items = list.querySelectorAll('.list-wrapper > div');
    expect(items.length).toEqual(4);

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
