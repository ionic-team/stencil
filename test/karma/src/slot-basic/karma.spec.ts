import { setupDomTests } from '../util';


describe('slot-basic', function() {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);


  it('button click rerenders', async function() {
    const component = await renderTest('/slot-basic/index.html');

    function testValues(inc: number) {
      let result = component.querySelector('.inc');
      expect(result.textContent).toEqual('Rendered: ' + inc);

      result = component.querySelector('.results1 article');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results2 article');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results2 article span');
      expect(result.textContent).toEqual('B');

      result = component.querySelector('.results3 article');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results3 article div');
      expect(result.textContent).toEqual('B');

      result = component.querySelector('.results4 article footer');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results4 article footer div');
      expect(result.textContent).toEqual('B');

      result = component.querySelector('.results5 article');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results5 article span');
      expect(result.textContent).toEqual('A');

      result = component.querySelector('.results6 article');
      expect(result.textContent).toEqual('AB');

      let results = component.querySelectorAll('.results6 article span');
      expect(results[0].textContent).toEqual('A');
      expect(results[1].textContent).toEqual('B');

      result = component.querySelector('.results7 article');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results7 article span');
      expect(result.textContent).toEqual('A');

      result = component.querySelector('.results7 article div');
      expect(result.textContent).toEqual('B');

      result = component.querySelector('.results8 article');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results8 article div');
      expect(result.textContent).toEqual('A');

      result = component.querySelector('.results9 article');
      expect(result.textContent).toEqual('AB');

      result = component.querySelector('.results9 article div');
      expect(result.textContent).toEqual('A');

      result = component.querySelector('.results9 article span');
      expect(result.textContent).toEqual('B');

      result = component.querySelector('.results10 article');
      expect(result.textContent).toEqual('AB');

      results = component.querySelectorAll('.results10 article div');
      expect(results[0].textContent).toEqual('A');
      expect(results[1].textContent).toEqual('B');

      result = component.querySelector('.results11 article');
      expect(result.textContent).toEqual('ABC');

      results = component.querySelectorAll('.results11 article div');
      expect(results[0].textContent).toEqual('A');
      expect(results[1].textContent).toEqual('B');
      expect(results[2].textContent).toEqual('C');

      result = component.querySelector('.results11 article footer');
      expect(result.textContent).toEqual('B');
    }

    testValues(1);

    let button = component.querySelector('button');
    button.click();
    await flush();
    testValues(2);

    button.click();
    await flush();
    testValues(3);
  });

});
