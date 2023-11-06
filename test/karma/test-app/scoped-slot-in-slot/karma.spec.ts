import { setupDomTests } from '../util';

describe('scoped-slot-in-slot', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);

  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/scoped-slot-in-slot/index.html');
    host = app.querySelector('ion-host');
  });

  afterEach(tearDownDom);

  it('correctly renders content slotted through multiple levels of nested slots', async () => {
    expect(host).toBeDefined();

    // Check the parent content
    const parent = host.querySelector('ion-parent');
    expect(parent).toBeDefined();
    expect(parent.firstElementChild.tagName).toBe('LABEL');

    // Ensure the label slot content made it through
    const span = parent.firstElementChild.firstElementChild;
    expect(span).toBeDefined();
    expect(span.tagName).toBe('SPAN');
    expect(span.textContent).toBe('Label text');

    // Ensure the message slot content made it through
    expect(parent.lastElementChild.tagName).toBe('SPAN');
    expect(parent.lastElementChild.textContent).toBe('Message text');

    // Check the child content
    const child = parent.querySelector('ion-child');
    expect(child).toBeDefined();

    // Ensure the suffix slot content made it through
    expect(child.firstElementChild.firstElementChild.tagName).toBe('SPAN');
    expect(child.firstElementChild.firstElementChild.textContent).toBe('Suffix text');
  });
});
