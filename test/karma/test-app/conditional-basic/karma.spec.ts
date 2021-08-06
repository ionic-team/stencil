import { setupDomTests, waitForChanges } from '../util';

describe('conditional-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/conditional-basic/index.html');
  });
  afterEach(tearDownDom);

  it('contains a button as a child', async () => {
    let button = app.querySelector('button');
    expect(button).toBeDefined();
  });

  it('button click rerenders', async () => {
    let button = app.querySelector('button');
    let results = app.querySelector('div.results');

    expect(results.textContent).toEqual('');

    button.click();
    await waitForChanges();

    expect(results.textContent).toEqual('Content');
  });
});
