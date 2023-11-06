import { setupDomTests } from '../util';

describe('non-shadow-to-shadow-slot-relocation', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('non-shadow-to-shadow-slot-relocation/index.html');
    host = app.querySelector('non-shadow-host');
  });

  afterEach(tearDownDom);

  it('should correctly render slotted content', () => {
    expect(host).toBeDefined();

    const mainDiv = host.firstElementChild.firstElementChild;
    expect(mainDiv).toBeDefined();
    expect(mainDiv.children.length).toBe(2);

    // Main content
    expect(mainDiv.children[0].tagName).toBe('B');
    expect(mainDiv.children[0].getAttribute('slot')).toBe('main-content');

    // Dropdown content
    const slottedDiv = mainDiv.children[1];
    expect(slottedDiv.tagName).toBe('DIV');
    expect(slottedDiv.getAttribute('slot')).toBe('dropdown-content-element');
    expect(slottedDiv.children.length).toBe(1);

    const slottedDropdownContent = slottedDiv.children[0];
    expect(slottedDropdownContent.tagName).toBe('DROP-DOWN-CONTENT');
    expect(slottedDropdownContent.children.length).toBe(1);
    expect(slottedDropdownContent.children[0].tagName).toBe('B');
    expect(slottedDropdownContent.children[0].getAttribute('slot')).toBe(null);
  });
});
