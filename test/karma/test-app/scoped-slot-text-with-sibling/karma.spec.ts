import { setupDomTests } from '../util';

describe('scoped-slot-text-with-sibling', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/scoped-slot-text-with-sibling/index.html');
  });

  afterEach(tearDownDom);

  /**
   * Helper function to retrieve custom element used by this test suite. If the element cannot be found, the test that
   * invoked this function shall fail.
   * @returns the custom element
   */
  function getCmpLabel(): HTMLCmpLabelElement {
    const customElementSelector = 'cmp-label-with-slot-sibling';
    const cmpLabel: HTMLCmpLabelElement = app.querySelector(customElementSelector);
    if (!cmpLabel) {
      fail(`Unable to find element using query selector '${customElementSelector}'`);
    }

    return cmpLabel;
  }

  it('sets the textContent in the slot location', () => {
    const cmpLabel: HTMLCmpLabelElement = getCmpLabel();

    cmpLabel.textContent = 'New text to go in the slot';

    expect(cmpLabel.textContent.trim()).toBe('New text to go in the slot');
  });

  it("doesn't override all children when assigning textContent", () => {
    const cmpLabel: HTMLCmpLabelElement = getCmpLabel();

    cmpLabel.textContent = "New text that we want to go in a slot, but don't care about for this test";

    const divElement: HTMLDivElement = cmpLabel.querySelector('div');
    expect(divElement?.textContent).toBe('Non-slotted text');
  });

  it('leaves the structure of the label intact', () => {
    const cmpLabel: HTMLCmpLabelElement = getCmpLabel();

    cmpLabel.textContent = 'New text for label structure testing';

    const label: HTMLLabelElement = cmpLabel.querySelector('label');

    /**
     * Expect three child nodes in the label
     * - a content reference text node
     * - the slotted text node
     * - the non-slotted text
     */
    expect(label).toBeDefined();
    expect(label.childNodes.length).toBe(3);
    expect((label.childNodes[0] as any)['s-cr'] as string).toBeDefined();
    expect(label.childNodes[1].textContent).toBe('New text for label structure testing');
    expect(label.childNodes[2].textContent).toBe('Non-slotted text');
  });
});
