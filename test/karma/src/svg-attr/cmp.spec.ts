import { setupDomTests, onComponentUpdate } from '../util';

describe('svg attr', () => {
  const { setupDom, tearDownDom, addComponent } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('adds and removes attribute', async function() {
    const component = await addComponent(`
      <svg-attr></svg-attr>
    `);

    const rect = component.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe(null);

    const button = component.querySelector('button');
    button.click();
    await onComponentUpdate(rect);
    expect(rect.getAttribute('transform')).toBe('rotate(45 27 27)');

    button.click();
    await onComponentUpdate(rect);
    expect(rect.getAttribute('transform')).toBe(null);
  });

});
