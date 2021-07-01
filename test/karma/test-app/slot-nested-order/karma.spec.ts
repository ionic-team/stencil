import { HTMLStencilElement } from '@stencil/core';
import { setupDomTests } from '../util';


describe('slot-nested-order', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-nested-order/index.html');
  });
  afterEach(tearDownDom);


  it('correct nested order', async () => {
    const root = app.querySelector('slot-nested-order-parent') as HTMLStencilElement;

    expect(root.__textContent).toBe('123456');

    const hiddenCmp = root.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

});
