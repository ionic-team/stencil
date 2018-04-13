import { setupDomTests } from '../util';


describe('conditional-basic', function() {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('contains a button as a child', async function() {
    const component = await renderTest('/conditional-basic/index.html');
    let button = component.querySelector('button');

    expect(button).toBeDefined();
  });


  it('button click rerenders', async function() {
    const component = await renderTest('/conditional-basic/index.html');
    let button = component.querySelector('button');
    let results = component.querySelector('div.results');

    expect(results.textContent).toEqual('');

    button.click();
    await flush();

    expect(results.textContent).toEqual('Content');
  });

});
