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
    expect(result.childNodes[0].textContent.trim()).toBe('slot - start');
    expect(result.childNodes[1].textContent.trim()).toBe('slot - default');
    expect(result.childNodes[2].textContent.trim()).toBe('slot - end');

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
