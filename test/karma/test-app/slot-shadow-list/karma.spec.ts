import { setupDomTests, waitForChanges } from '../util';

describe('slot-shadow-list', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-shadow-list/index.html');
  });
  afterEach(tearDownDom);

  it('renders this list in correct slots', async () => {
    let button: HTMLButtonElement = app.querySelector('slot-list-light-root button');
    let list = app.querySelector('slot-dynamic-shadow-list');

    expect(button).toBeTruthy();
    expect(list).toBeTruthy();

    let items = list.shadowRoot.querySelectorAll('.list-wrapper > div');
    expect(items.length).toEqual(0);

    button.click();
    await waitForChanges();

    items = list.shadowRoot.querySelectorAll('.list-wrapper > div');
    expect(items.length).toEqual(4);

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
