import { setupDomTests, waitForChanges } from '../util';

describe('listen-reattach', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/listen-reattach/index.html');
  });
  afterEach(tearDownDom);

  it('should receive click events, remove/attach, and receive more events', async () => {
    const clicked = app.querySelector('#clicked');
    expect(clicked.textContent.trim()).toBe('Clicked: 0');

    const elm = app.querySelector('listen-reattach') as any;

    elm.click();
    await waitForChanges();
    expect(clicked.textContent.trim()).toBe('Clicked: 1');

    elm.click();
    await waitForChanges();
    expect(clicked.textContent.trim()).toBe('Clicked: 2');

    const moveIt = app.querySelector('#moveIt') as any;
    moveIt.click();
    await waitForChanges();

    elm.click();
    await waitForChanges();
    expect(clicked.textContent.trim()).toBe('Clicked: 3');

    elm.click();
    await waitForChanges();
    expect(clicked.textContent.trim()).toBe('Clicked: 4');
  });
});
