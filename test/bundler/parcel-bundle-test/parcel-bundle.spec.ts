import { setupDomTests } from '../karma-stencil-utils';

describe('parcel-bundle', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/parcel-bundle-test/dist/index.html');
  });
  afterEach(tearDownDom);

  it('should load content from dynamic import', () => {
    const cmpShadowRoot = app.querySelector('my-component')?.shadowRoot;
    if (!cmpShadowRoot) {
      fail(`unable to find shadow root on component 'my-component'`);
    }
    expect(cmpShadowRoot.textContent?.trim()).toBe("Hello, World! I'm Stencil 'Don't call me a framework' JS");
  });
});
