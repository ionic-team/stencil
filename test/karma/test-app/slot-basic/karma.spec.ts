import { setupDomTests, waitForChanges } from '../util';

describe('slot-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-basic/index.html');
  });
  afterEach(tearDownDom);

  it('button click rerenders', async () => {
    function testValues(inc: number) {
      let result = app.querySelector('.inc');
      expect(result.textContent).toEqual('Rendered: ' + inc);

      result = app.querySelector('.results1 article');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results2 article');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results2 article span');
      expect(result.textContent).toEqual('B');

      result = app.querySelector('.results3 article');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results3 article div');
      expect(result.textContent).toEqual('B');

      result = app.querySelector('.results4 article footer');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results4 article footer div');
      expect(result.textContent).toEqual('B');

      result = app.querySelector('.results5 article');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results5 article span');
      expect(result.textContent).toEqual('A');

      result = app.querySelector('.results6 article');
      expect(result.textContent).toEqual('AB');

      let results = app.querySelectorAll('.results6 article span');
      expect(results[0].textContent).toEqual('A');
      expect(results[1].textContent).toEqual('B');

      result = app.querySelector('.results7 article');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results7 article span');
      expect(result.textContent).toEqual('A');

      result = app.querySelector('.results7 article div');
      expect(result.textContent).toEqual('B');

      result = app.querySelector('.results8 article');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results8 article div');
      expect(result.textContent).toEqual('A');

      result = app.querySelector('.results9 article');
      expect(result.textContent).toEqual('AB');

      result = app.querySelector('.results9 article div');
      expect(result.textContent).toEqual('A');

      result = app.querySelector('.results9 article span');
      expect(result.textContent).toEqual('B');

      result = app.querySelector('.results10 article');
      expect(result.textContent).toEqual('AB');

      results = app.querySelectorAll('.results10 article div');
      expect(results[0].textContent).toEqual('A');
      expect(results[1].textContent).toEqual('B');

      result = app.querySelector('.results11 article');
      expect(result.textContent).toEqual('ABC');

      results = app.querySelectorAll('.results11 article div');
      expect(results[0].textContent).toEqual('A');
      expect(results[1].textContent).toEqual('B');
      expect(results[2].textContent).toEqual('C');

      result = app.querySelector('.results11 article footer');
      expect(result.textContent).toEqual('B');
    }

    testValues(1);

    let button = app.querySelector('button');
    button.click();
    await waitForChanges();
    testValues(2);

    button.click();
    await waitForChanges();
    testValues(3);
  });
});
