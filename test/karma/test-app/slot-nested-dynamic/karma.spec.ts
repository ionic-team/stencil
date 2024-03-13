import { setupDomTests, waitForChanges } from '../util';

const ITEM_CLASSNAME = 'default-slot-item';

describe('slot-nested-dynamic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  const getParent = () => app.querySelector('slot-nested-dynamic-parent');
  const getRandomizeButton = () => app.querySelector<HTMLButtonElement>('#randomizeButton');
  const getItems = () => app.querySelectorAll(`.${ITEM_CLASSNAME}`);

  beforeEach(async () => {
    app = await setupDom('/slot-nested-dynamic/index.html');
  });
  afterEach(tearDownDom);

  it('initially correct order', async () => {
    const parent = getParent();

    /* CLEANUP */
    for (const item of Array.from(getItems()) || []) {
      item.remove();
    }

    /* ADD DYNAMICALLY FOR INITIAL RENDER */
    Array.from(new Array(3)).map((_, i) => {
      const element = document.createElement('span');
      element.className = ITEM_CLASSNAME;
      element.textContent = `item-${i}`;
      parent?.appendChild(element);
    });

    await waitForChanges();
    const items = getItems();
    expect(items[0].textContent).toBe('item-0');
    expect(items[1].textContent).toBe('item-1');
    expect(items[2].textContent).toBe('item-2');
  });

  it('correct order after dynamic list generation', async () => {
    const button = getRandomizeButton();

    /* RUN DYNAMIC GENERATION */
    button.click();
    await waitForChanges();
    const items = getItems();
    expect(items[0].textContent).toBe('item-0');
    expect(items[1].textContent).toBe('item-1');
    expect(items[2].textContent).toBe('item-2');

    /* RE-RUN DYNAMIC GENERATION */
    button.click();
    await waitForChanges();
    const itemsRoundTwo = getItems();
    expect(itemsRoundTwo[0].textContent).toBe('item-0');
    expect(itemsRoundTwo[1].textContent).toBe('item-1');
    expect(itemsRoundTwo[2].textContent).toBe('item-2');
  });
});
