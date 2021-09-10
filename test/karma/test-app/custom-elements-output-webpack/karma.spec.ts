import { setupDomTests } from '../util';

describe('custom-elements-output-webpack', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/custom-elements-output-webpack/index.html');
  });
  afterEach(tearDownDom);

  it('defines components and their dependencies', async () => {
    expect(customElements.get('custom-element-root')).toBeDefined();
    expect(customElements.get('custom-element-child')).toBeDefined();
    expect(customElements.get('custom-element-nested-child')).toBeDefined();

    const elm = app.querySelector('custom-element-root');
    const childElm = elm.shadowRoot.querySelector('custom-element-child');
    const childNestedElm = childElm.shadowRoot.querySelector('custom-element-nested-child');

    expect(elm.shadowRoot).toBeDefined();
    expect(childElm.shadowRoot).toBeDefined();
    expect(childNestedElm.shadowRoot).toBeDefined();
  });
});
