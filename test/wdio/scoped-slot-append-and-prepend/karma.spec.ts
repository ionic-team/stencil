import { setupDomTests, waitForChanges } from '../util';

describe('scoped-slot-append-and-prepend', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);

  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;
  let parentDiv: HTMLDivElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/scoped-slot-append-and-prepend/index.html');
    host = app.querySelector('scoped-slot-append-and-prepend');
    parentDiv = host.querySelector('#parentDiv');
  });

  afterEach(tearDownDom);

  describe('append', () => {
    it('inserts a DOM element at the end of the slot', async () => {
      expect(host).toBeDefined();

      expect(parentDiv).toBeDefined();
      expect(parentDiv.children.length).toBe(1);
      expect(parentDiv.children[0].textContent).toBe('My initial slotted content.');

      const addButton = app.querySelector<HTMLButtonElement>('#appendNodes');
      addButton.click();
      await waitForChanges();

      expect(parentDiv.children.length).toBe(2);
      expect(parentDiv.children[1].textContent).toBe('The new slotted content.');
    });
  });

  describe('appendChild', () => {
    it('inserts a DOM element at the end of the slot', async () => {
      expect(host).toBeDefined();

      expect(parentDiv).toBeDefined();
      expect(parentDiv.children.length).toBe(1);
      expect(parentDiv.children[0].textContent).toBe('My initial slotted content.');

      const addButton = app.querySelector<HTMLButtonElement>('#appendChildNodes');
      addButton.click();
      await waitForChanges();

      expect(parentDiv.children.length).toBe(2);
      expect(parentDiv.children[1].textContent).toBe('The new slotted content.');
    });
  });

  describe('prepend', () => {
    it('inserts a DOM element at the start of the slot', async () => {
      expect(host).toBeDefined();

      expect(parentDiv).toBeDefined();
      expect(parentDiv.children.length).toBe(1);
      expect(parentDiv.children[0].textContent).toBe('My initial slotted content.');

      const addButton = app.querySelector<HTMLButtonElement>('#prependNodes');
      addButton.click();
      await waitForChanges();

      expect(parentDiv.children.length).toBe(2);
      expect(parentDiv.children[0].textContent).toBe('The new slotted content.');
    });
  });
});
