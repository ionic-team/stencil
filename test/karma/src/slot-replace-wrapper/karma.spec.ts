import { setupDomTests } from '../util';

describe('slot replace wrapper', () => {
  const { setupDom, tearDownDom, renderTest } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('renders', async () => {
    const component = await renderTest('/slot-replace-wrapper/index.html');

    let result = component.querySelector('.results1 a');
    expect(result.textContent.trim()).toBe('A');
    expect(result.children[0].textContent.trim()).toBe('A');

    result = component.querySelector('.results2 a');
    expect(result.textContent.trim()).toBe('B');
    expect(result.children[0].children[0].textContent.trim()).toBe('B');

    result = component.querySelector('.results3 a');
    expect(result.textContent.trim()).toBe('C');
    expect(result.children[0].children[0].children[0].textContent.trim()).toBe('C');

    result = component.querySelector('.results4 a');
    expect(result.textContent.trim()).toBe('ABC');
    expect(result.children[0].textContent.trim()).toBe('A');
    expect(result.children[1].children[0].textContent.trim()).toBe('B');
    expect(result.children[1].children[1].children[0].textContent.trim()).toBe('C');

    result = component.querySelector('.results5 a');
    expect(result.textContent.trim()).toBe('ABC');
    expect(result.children[0].textContent.trim()).toBe('A');
    expect(result.children[1].children[0].textContent.trim()).toBe('B');
    expect(result.children[1].children[1].children[0].textContent.trim()).toBe('C');

    result = component.querySelector('.results6 a');
    expect(result.textContent.trim()).toBe('ABC');
    expect(result.children[0].textContent.trim()).toBe('A');
    expect(result.children[1].children[0].textContent.trim()).toBe('B');
    expect(result.children[1].children[1].children[0].textContent.trim()).toBe('C');

    result = component.querySelector('.results7 a');
    expect(result.textContent.trim()).toBe('A1A2B1B2C1C2');

    result = component.querySelector('.results8 a');
    expect(result.textContent.trim()).toBe('A1A2B1B2C1C2');
  });
});
