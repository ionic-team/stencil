import { setupDomTests } from '../util';

describe('svg class', () => {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('toggles svg class', async function() {
    const component = await renderTest('/svg-class/index.html');

    const svg = component.querySelector('svg');
    const circle = component.querySelector('circle');
    const line = component.querySelector('line');

    expect(svg.getAttribute('class')).toBe('');
    expect(circle.getAttribute('class')).toBe('');
    expect(line.getAttribute('class')).toBe('');

    const button = component.querySelector('button');
    button.click();

    await flush();

    expect(svg.getAttribute('class')).toBe('red');
    expect(circle.getAttribute('class')).toBe('green');
    expect(line.getAttribute('class')).toBe('blue');
  });

});
