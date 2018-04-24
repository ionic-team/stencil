import { setupDomTests } from '../util';

describe('svg class', () => {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('toggles svg class', async () => {
    const component = await renderTest('/svg-class/index.html');

    const svg = component.querySelector('svg');
    const circle = component.querySelector('circle');
    const rect = component.querySelector('rect');

    expect(svg.getAttribute('class')).toBe('');
    expect(circle.getAttribute('class')).toBe('');
    expect(rect.getAttribute('class')).toBe('');

    const button = component.querySelector('button');
    button.click();

    await flush();

    expect(svg.getAttribute('class')).toBe('primary');
    expect(circle.getAttribute('class')).toBe('red');
    expect(rect.getAttribute('class')).toBe('blue');
  });

});
