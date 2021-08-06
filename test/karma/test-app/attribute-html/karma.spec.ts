import { setupDomTests } from '../util';

describe('attribute-html', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/attribute-html/index.html');
  });
  afterEach(tearDownDom);

  it('should have proper values', async () => {
    expect(app.querySelector('#str-attr').textContent).toBe('my string string');
    expect(app.querySelector('#any-attr').textContent).toBe('0 string');
    expect(app.querySelector('#nu-attr').textContent).toBe('12 number');
  });
});
