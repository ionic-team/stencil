import { setupDomTests } from '../util';

describe('shadow-dom-array', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/shadow-dom-array/index.html');
  });
  afterEach(tearDownDom);

  it('renders children', (done) => {
    let r = app.querySelector('shadow-dom-array');
    expect(r.shadowRoot.children.length).toBe(1);
    expect(r.shadowRoot.children[0].textContent.trim()).toBe('0');

    const button = app.querySelector('button');
    button.click();
    setTimeout(() => {
      expect(r.shadowRoot.children.length).toBe(2);
      expect(r.shadowRoot.children[1].textContent.trim()).toBe('1');

      button.click();
      setTimeout(() => {
        expect(r.shadowRoot.children.length).toBe(3);
        expect(r.shadowRoot.children[2].textContent.trim()).toBe('2');
        done();
      }, 100);
    }, 100);
  });
});
