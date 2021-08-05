import { setupDomTests, waitForChanges } from '../util';

describe('listen-jsx', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/listen-jsx/index.html');
  });
  afterEach(tearDownDom);

  it('button click trigger both listeners', async () => {
    (app.querySelector('listen-jsx') as HTMLElement).click();

    await waitForChanges();

    expect(app.querySelector('#result').textContent).toBe('Host event');
    expect(app.querySelector('#result-root').textContent).toBe('Parent event');
  });
});
