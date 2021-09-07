import { setupDomTests } from '../util';

describe('dist-custom-elements-webpack', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/dist-custom-elements-webpack/index.html');
  });
  afterEach(tearDownDom);

  it('defines components', async () => {
    const elm = app.querySelector('shadow-dom-slot-nested-root');
    expect(elm.shadowRoot).toBeDefined();

    const nestedElm = elm.shadowRoot.querySelector('shadow-dom-slot-nested');
    expect(nestedElm.shadowRoot).toBeDefined();
  });
});
