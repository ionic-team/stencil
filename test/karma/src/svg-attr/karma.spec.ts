import { setupDomTests } from '../util';

describe('svg attr', () => {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('adds and removes attribute', async function() {
    const component = await renderTest('/svg-attr/index.html');

    const rect = component.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe(null);

    const button = component.querySelector('button');
    button.click();
    await flush();
    expect(rect.getAttribute('transform')).toBe('rotate(45 27 27)');

    button.click();
    await flush();
    expect(rect.getAttribute('transform')).toBe(null);
  });

});
