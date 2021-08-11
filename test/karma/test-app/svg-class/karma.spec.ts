import { setupDomTests, waitForChanges } from '../util';

describe('svg class', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/svg-class/index.html');
  });
  afterEach(tearDownDom);

  it('toggles svg class', async () => {
    const svg = app.querySelector('svg');
    const circle = app.querySelector('circle');
    const rect = app.querySelector('rect');

    expect(svg.getAttribute('class')).toBe(null);
    expect(circle.getAttribute('class')).toBe(null);
    expect(rect.getAttribute('class')).toBe(null);

    const button = app.querySelector('button');
    button.click();

    await waitForChanges();

    expect(svg.getAttribute('class')).toBe('primary');
    expect(circle.getAttribute('class')).toBe('red');
    expect(rect.getAttribute('class')).toBe('blue');
  });
});
