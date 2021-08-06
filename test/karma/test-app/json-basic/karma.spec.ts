import { setupDomTests } from '../util';

describe('attribute-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/json-basic/index.html');
  });
  afterEach(tearDownDom);

  it('read json content', async () => {
    expect(app.querySelector('#json-foo').textContent).toBe('bar');
  });
});
