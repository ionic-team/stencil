import { setupDomTests } from '../util';

describe('custom-elements-output-webpack', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/custom-elements-output-webpack/index.html');
  });
  afterEach(tearDownDom);

  it('defines components and their dependencies', async () => {
    const elm = app.querySelector('custom-element-root');
    expect(elm.shadowRoot).toBeDefined();

    const childElm = elm.shadowRoot.querySelector('custom-element-child');
    expect(childElm.shadowRoot).toBeDefined();

    const childNestedElm = elm.shadowRoot.querySelector('custom-element-nested-child');
    expect(childNestedElm.shadowRoot).toBeDefined();
  });
});
