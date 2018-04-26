import { setupDomTests } from '../util';

describe('slot array complex', () => {
  const { setupDom, tearDownDom, renderTest } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('renders slotted content', async () => {
    const component = await renderTest('/slot-array-complex/index.html');

    let result = component.querySelector('main slot-array-complex');
    expect(result.children[0].textContent.trim()).toBe('slot - start');
    expect(result.children[1].textContent.trim()).toBe('slot - default');
    expect(result.children[2].textContent.trim()).toBe('slot - end');
  });
});
