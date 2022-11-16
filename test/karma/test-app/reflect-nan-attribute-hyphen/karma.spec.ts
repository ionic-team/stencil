import { setupDomTests } from '../util';

describe('reflect-nan-attribute-hyphen', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/reflect-nan-attribute-hyphen/index.html');
  });
  afterEach(tearDownDom);

  it('renders the component the correct number of times', async () => {
    const cmpShadowRoot = app.querySelector('reflect-nan-attribute-hyphen')?.shadowRoot;
    if (!cmpShadowRoot) {
      fail(`unable to find shadow root on component 'reflect-nan-attribute-hyphen'`);
    }

    expect(cmpShadowRoot.textContent).toEqual('reflect-nan-attribute-hyphen Render Count: 1');
  });
});
