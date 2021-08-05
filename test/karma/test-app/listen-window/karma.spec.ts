import { setupDomTests, waitForChanges } from '../util';

describe('listen-window', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/listen-window/index.html');
  });
  afterEach(tearDownDom);

  it('window should receive click events', async () => {
    const clicked = app.querySelector('#clicked');
    expect(clicked.textContent.trim()).toBe('Clicked: 0');

    const btn = app.querySelector('button');
    btn.click();

    await waitForChanges();

    expect(clicked.textContent.trim()).toBe('Clicked: 1');
  });
});
