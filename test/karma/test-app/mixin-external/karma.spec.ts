import { setupDomTests } from '../util';

describe('mixin-external', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/mixin-external/index.html');
  });
  afterEach(tearDownDom);

  it('rerenders a mixin component from an external repo', async () => {
    if ('shadowRoot' in HTMLElement.prototype) {
      await testNativeShadowDom();
    } else {
      await testSlotPolyfill();
    }
  });

  async function testNativeShadowDom() {
    const mixinCmp = app.querySelector('mixin-external');
    expect(mixinCmp.routerDirection).toBe('forward');

    const ionButton = mixinCmp.shadowRoot.querySelector('button');
    const ionButtonStyles = window.getComputedStyle(ionButton);
    expect(ionButtonStyles.backgroundColor).toBe('rgb(56, 128, 255)');

    const addedNode = mixinCmp.shadowRoot.querySelector('div');
    expect(addedNode.innerText).toBe('THIS IS A LOCAL NODE');
  }

  async function testSlotPolyfill() {
    const mixinCmp = app.querySelector('mixin-external');
    expect(mixinCmp.routerDirection).toBe('forward');

    const addedNode = mixinCmp.shadowRoot.querySelector('div');
    expect(addedNode.innerText).toBe('THIS IS A LOCAL NODE');
  }
});
