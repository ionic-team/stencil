import { setupDomTests } from '../util';


describe('conditional-rerender', function() {
  const { setupDom, tearDownDom, renderTest } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('contains a button as a child', async (done) => {
    const component = await renderTest('/conditional-rerender/index.html');

    setTimeout(() => {
      const main = component.querySelector('main');

      expect(main.children[0].textContent.trim()).toBe('Header');
      expect(main.children[1].textContent.trim()).toBe('Content');
      expect(main.children[2].textContent.trim()).toBe('Footer');
      expect(main.children[3].textContent.trim()).toBe('Nav');

      done();
    }, 500);

  });

});
