import { setupDomTests } from '../util';


describe('attribute-basic', function() {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('button click rerenders', async function() {
    const component = await renderTest('/attribute-basic/index.html');

    expect(component.querySelector('.single').textContent).toBe('single');
    expect(component.querySelector('.multiWord').textContent).toBe('multiWord');
    expect(component.querySelector('.customAttr').textContent).toBe('my-custom-attr');

    const button = component.querySelector('button');
    button.click();

    await flush();

    expect(component.querySelector('.single').textContent).toBe('single-update');
    expect(component.querySelector('.multiWord').textContent).toBe('multiWord-update');
    expect(component.querySelector('.customAttr').textContent).toBe('my-custom-attr-update');
  });

});
