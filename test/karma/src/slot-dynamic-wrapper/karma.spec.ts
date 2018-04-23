import { setupDomTests } from '../util';


describe('slot-dynamic-wrapper', () => {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);


  it('renders', async () => {
    let component = await renderTest('/slot-dynamic-wrapper/index.html');
    let result: HTMLElement;

    result = component.querySelector('.results1 section h1');
    expect(result.textContent.trim()).toBe('parent text');

    let button = component.querySelector('button');
    button.click();
    await flush();

    result = component.querySelector('.results1 section h1');
    expect(result).toBe(null);

    result = component.querySelector('.results1 article h1');
    expect(result.textContent.trim()).toBe('parent text');

    button.click();
    await flush();

    result = component.querySelector('.results1 section h1');
    expect(result.textContent.trim()).toBe('parent text');

    result = component.querySelector('.results1 article h1');
    expect(result).toBe(null);
  });

});
