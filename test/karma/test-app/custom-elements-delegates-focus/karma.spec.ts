import { setupDomTests } from '../util';

describe('custom-elements-delegates-focus', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/custom-elements-delegates-focus/index.html');
  });
  afterEach(tearDownDom);

  it('sets delegatesFocus correctly', async () => {
    expect(customElements.get('custom-elements-delegates-focus')).toBeDefined();

    const elm: Element = app.querySelector('custom-elements-delegates-focus');

    expect(elm.shadowRoot).toBeDefined();
    // as of TypeScript 4.3, `delegatesFocus` does not exist on the `shadowRoot` object
    expect((elm.shadowRoot as any).delegatesFocus).toBe(true);
  });

  it('does not set delegatesFocus when shadow is set to "true"', async () => {
    expect(customElements.get('custom-elements-no-delegates-focus')).toBeDefined();

    const elm: Element = app.querySelector('custom-elements-no-delegates-focus');

    expect(elm.shadowRoot).toBeDefined();
    // as of TypeScript 4.3, `delegatesFocus` does not exist on the `shadowRoot` object
    expect((elm.shadowRoot as any).delegatesFocus).toBe(false);
  });
});
