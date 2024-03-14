import { setupDomTests } from '../util';

describe('custom-elements-output-tag-class-different', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/custom-elements-output-tag-class-different/index.html');
  });
  afterEach(tearDownDom);

  it('defines components and their dependencies', async () => {
    expect(customElements.get('custom-element-root-different-name-than-class')).toBeDefined();

    const elm = app.querySelector('custom-element-root-different-name-than-class');
    expect(elm.shadowRoot).toBeDefined();

    const childElm = elm.shadowRoot.querySelector('custom-element-child-different-name-than-class');
    expect(childElm.shadowRoot).toBeDefined();
  });
});
