import { setupDomTests, waitForChanges } from '../util';

describe('slot-list', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-list/index.html');
  });
  afterEach(tearDownDom);

  it('renders this list in correct slots', async () => {
    let button: HTMLButtonElement = app.querySelector(
      'slot-list-light-root button'
    );
    let list = app.querySelector('slot-dynamic-list');

    expect(button).toBeTruthy();
    expect(list).toBeTruthy();

    let items = list.shadowRoot.querySelectorAll('.list-wrapper > div');
    expect(items.length).toEqual(0);

    button.click();
    await waitForChanges();
    console.log(list.innerHTML);

    items = list.shadowRoot.querySelectorAll('.list-wrapper > div');
    expect(items.length).toEqual(4);
  });
});
