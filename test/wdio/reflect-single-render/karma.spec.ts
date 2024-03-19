import { setupDomTests } from '../util';

describe('reflect-single-render', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/reflect-single-render/index.html');
  });
  afterEach(tearDownDom);

  it('renders the parent and child the correct number of times', async () => {
    const parentShadowRoot = app.querySelector('parent-with-reflect-child')?.shadowRoot;
    if (!parentShadowRoot) {
      fail(`unable to find shadow root on component 'parent-with-reflect-child'`);
    }

    const childShadowRoot = parentShadowRoot.querySelector('child-with-reflection')?.shadowRoot;
    if (!childShadowRoot) {
      fail(`unable to find shadow root on component 'child-with-reflection'`);
    }

    expect(parentShadowRoot.textContent).toEqual('Parent Render Count: 1');
    expect(childShadowRoot.textContent).toEqual('Child Render Count: 1');
  });
});
