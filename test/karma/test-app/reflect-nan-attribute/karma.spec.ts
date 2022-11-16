import { setupDomTests } from '../util';

describe('reflect-nan-attribute', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/reflect-nan-attribute/index.html');
  });
  afterEach(tearDownDom);

  it('renders the component the correct number of times', async () => {
    const cmpShadowRoot = app.querySelector('reflect-nan-attribute')?.shadowRoot;
    if (!cmpShadowRoot) {
      fail(`unable to find shadow root on component 'reflect-nan-attribute'`);
    }

    expect(cmpShadowRoot.textContent).toEqual('reflect-nan-attribute Render Count: 1');
  });
});
