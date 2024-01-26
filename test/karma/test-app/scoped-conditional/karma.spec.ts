import { setupDomTests, waitForChanges } from '../util';

describe('scoped-conditional', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/scoped-conditional/index.html');
  });

  afterEach(tearDownDom);

  it('renders the initial slotted content', () => {
    const host = app.querySelector('scoped-conditional');
    const outerDiv = host.querySelector('div');

    expect(outerDiv.textContent).toBe(
      `before slot->
  This div will be slotted in
<-after slot`,
    );
  });

  it('renders the slotted content after toggling the message', async () => {
    // toggle the 'Hello' message, which should insert a new <div/> into the DOM & _not_ remove the slotted content
    const toggleButton = app.querySelector<HTMLButtonElement>('#toggleHello');
    toggleButton.click();
    await waitForChanges();

    const host = app.querySelector('scoped-conditional');
    const outerDivChildren = host.querySelector('div').childNodes;

    expect(outerDivChildren.length).toBe(2);

    expect(outerDivChildren[0].textContent).toBe('Hello');
    expect(outerDivChildren[1].textContent).toBe(
      `before slot->
  This div will be slotted in
<-after slot`,
    );
  });

  it('renders the slotted content after toggling the twice message', async () => {
    // toggle the 'Hello' message twice, which should insert a new <div/> into the DOM, then remove it.
    // as a result of the toggle, we should _not_ remove the slotted content
    const toggleButton = app.querySelector<HTMLButtonElement>('#toggleHello');
    toggleButton.click();
    await waitForChanges();
    toggleButton.click();
    await waitForChanges();

    const host = app.querySelector('scoped-conditional');
    const outerDiv = host.querySelector('div');

    expect(outerDiv.textContent).toBe(
      `before slot->
  This div will be slotted in
<-after slot`,
    );
  });
});
