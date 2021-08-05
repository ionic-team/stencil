import { setupDomTests, waitForChanges } from '../util';

describe('slot-light-dom', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-light-dom/index.html');
  });
  afterEach(tearDownDom);

  it('renders light dom in correct slots', async () => {
    let results = app.querySelector('.results1 article');
    expect(results.textContent).toBe('a');

    results = app.querySelector('.results2 article');
    expect(results.textContent).toBe('b');

    results = app.querySelector('.results3 article nav');
    expect(results.textContent).toBe('c');

    results = app.querySelector('.results4 article nav');
    expect(results.textContent).toBe('d');

    results = app.querySelector('.results4 article');
    expect(results.textContent).toBe('de');

    results = app.querySelector('.results5 article');
    expect(results.textContent).toBe('fg');

    results = app.querySelector('.results5 article nav');
    expect(results.textContent).toBe('g');

    results = app.querySelector('.results6 article');
    expect(results.textContent).toBe('hij');

    results = app.querySelector('.results6 article nav');
    expect(results.textContent).toBe('i');

    results = app.querySelector('.results7 article');
    expect(results.textContent).toBe('klm');

    let navs = app.querySelectorAll('.results7 article nav');
    expect(navs[0].textContent).toBe('k');
    expect(navs[1].textContent).toBe('l');
    expect(navs[2].textContent).toBe('m');

    const button = app.querySelector('button');
    button.click();
    await waitForChanges();

    results = app.querySelector('.results1 article');
    expect(results.textContent).toBe('A');

    results = app.querySelector('.results2 article');
    expect(results.textContent).toBe('B');

    results = app.querySelector('.results3 article nav');
    expect(results.textContent).toBe('C');

    results = app.querySelector('.results4 article nav');
    expect(results.textContent).toBe('D');

    results = app.querySelector('.results4 article');
    expect(results.textContent).toBe('DE');

    results = app.querySelector('.results5 article');
    expect(results.textContent).toBe('FG');

    results = app.querySelector('.results5 article nav');
    expect(results.textContent).toBe('G');

    results = app.querySelector('.results6 article');
    expect(results.textContent).toBe('HIJ');

    results = app.querySelector('.results6 article nav');
    expect(results.textContent).toBe('I');

    results = app.querySelector('.results7 article');
    expect(results.textContent).toBe('KLM');

    navs = app.querySelectorAll('.results7 article nav');
    expect(navs[0].textContent).toBe('K');
    expect(navs[1].textContent).toBe('L');
    expect(navs[2].textContent).toBe('M');

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
