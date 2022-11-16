import { setupDomTests } from '../util';

describe('conditional-rerender', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/conditional-rerender/index.html');
  });
  afterEach(tearDownDom);

  it('contains a button as a child', (done) => {
    // the component has its own `setTimeout` call, therefore we must wait for that to finish using
    // our own `setTimeout` call with a larger timeout value
    setTimeout(() => {
      const main = app.querySelector('main');

      expect(main.children[0].textContent.trim()).toBe('Header');
      expect(main.children[1].textContent.trim()).toBe('Content');
      expect(main.children[2].textContent.trim()).toBe('Footer');
      expect(main.children[3].textContent.trim()).toBe('Nav');

      done();
    }, 500);
  });
});
