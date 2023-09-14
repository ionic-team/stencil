import { setupDomTests, waitForChanges } from '../util';

describe('delegates-focus', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/delegates-focus/index.html');
  });
  afterEach(tearDownDom);

  it('should delegate focus', async () => {
    const button = app.querySelector('button');
    const delegateFocusElm = app.querySelector('delegates-focus');
    const noDelegateFocusElm = app.querySelector('no-delegates-focus');

    const delegateFocusStyles1 = window.getComputedStyle(delegateFocusElm);
    expect(delegateFocusStyles1.borderColor).toBe('rgb(255, 0, 0)');

    const noDelegateFocusStyles1 = window.getComputedStyle(noDelegateFocusElm);
    expect(noDelegateFocusStyles1.borderColor).toBe('rgb(255, 0, 0)');

    button.click();
    await waitForChanges(1000);

    const delegateFocusStyles2 = window.getComputedStyle(delegateFocusElm);
    expect(delegateFocusStyles2.borderColor).toBe('rgb(0, 0, 255)');

    const noDelegateFocusStyles2 = window.getComputedStyle(noDelegateFocusElm);
    expect(noDelegateFocusStyles2.borderColor).toBe('rgb(255, 0, 0)');
  });
});
