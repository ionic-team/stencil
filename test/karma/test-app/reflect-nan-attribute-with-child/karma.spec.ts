import { setupDomTests } from '../util';

describe('reflect-nan-attribute-with-child', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/reflect-nan-attribute-with-child/index.html');
  });
  afterEach(tearDownDom);

  it('renders the parent and child the correct number of times', async () => {
    const parentShadowRoot = app.querySelector('parent-reflect-nan-attribute')?.shadowRoot;
    if (!parentShadowRoot) {
      fail(`unable to find shadow root on component 'parent-reflect-nan-attribute'`);
    }

    const childShadowRoot = parentShadowRoot.querySelector('child-reflect-nan-attribute')?.shadowRoot;
    if (!childShadowRoot) {
      fail(`unable to find shadow root on component 'child-with-reflection'`);
    }

    expect(parentShadowRoot.textContent).toEqual('parent-reflect-nan-attribute Render Count: 1');
    expect(childShadowRoot.textContent).toEqual('child-reflect-nan-attribute Render Count: 1');
  });
});
