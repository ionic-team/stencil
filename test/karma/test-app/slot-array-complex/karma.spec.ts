import { setupDomTests } from '../util';

describe('slot array complex', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-array-complex/index.html');
  });
  afterEach(tearDownDom);

  it('renders slotted content', async () => {
    let result = app.querySelector('main slot-array-complex');
    expect(result.children[0].textContent.trim()).toBe('slot - start');
    expect(result.children[1].textContent.trim()).toBe('slot - default');
    expect(result.children[2].textContent.trim()).toBe('slot - end');

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
