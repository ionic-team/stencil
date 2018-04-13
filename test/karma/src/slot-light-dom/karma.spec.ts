import { setupDomTests } from '../util';

describe('slot-light-dom', () => {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('renders light dom in correct slots', async function() {
    const component = await renderTest('/slot-light-dom/index.html');

    let results = component.querySelector('.results1 article');
    expect(results.textContent).toBe('a');

    results = component.querySelector('.results2 article');
    expect(results.textContent).toBe('b');

    results = component.querySelector('.results3 article nav');
    expect(results.textContent).toBe('c');

    results = component.querySelector('.results4 article nav');
    expect(results.textContent).toBe('d');

    results = component.querySelector('.results4 article');
    expect(results.textContent).toBe('de');

    results = component.querySelector('.results5 article');
    expect(results.textContent).toBe('fg');

    results = component.querySelector('.results5 article nav');
    expect(results.textContent).toBe('g');

    results = component.querySelector('.results6 article');
    expect(results.textContent).toBe('hij');

    results = component.querySelector('.results6 article nav');
    expect(results.textContent).toBe('i');

    results = component.querySelector('.results7 article');
    expect(results.textContent).toBe('klm');

    let navs = component.querySelectorAll('.results7 article nav');
    expect(navs[0].textContent).toBe('k');
    expect(navs[1].textContent).toBe('l');
    expect(navs[2].textContent).toBe('m');

    const button = component.querySelector('button');
    button.click();
    await flush();

    results = component.querySelector('.results1 article');
    expect(results.textContent).toBe('A');

    results = component.querySelector('.results2 article');
    expect(results.textContent).toBe('B');

    results = component.querySelector('.results3 article nav');
    expect(results.textContent).toBe('C');

    results = component.querySelector('.results4 article nav');
    expect(results.textContent).toBe('D');

    results = component.querySelector('.results4 article');
    expect(results.textContent).toBe('DE');

    results = component.querySelector('.results5 article');
    expect(results.textContent).toBe('FG');

    results = component.querySelector('.results5 article nav');
    expect(results.textContent).toBe('G');

    results = component.querySelector('.results6 article');
    expect(results.textContent).toBe('HIJ');

    results = component.querySelector('.results6 article nav');
    expect(results.textContent).toBe('I');

    results = component.querySelector('.results7 article');
    expect(results.textContent).toBe('KLM');

    navs = component.querySelectorAll('.results7 article nav');
    expect(navs[0].textContent).toBe('K');
    expect(navs[1].textContent).toBe('L');
    expect(navs[2].textContent).toBe('M');
  });

});
