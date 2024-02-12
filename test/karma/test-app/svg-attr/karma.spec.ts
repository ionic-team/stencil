import { setupDomTests, waitForChanges } from '../util';

describe('svg attr', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/svg-attr/index.html');
  });
  afterEach(tearDownDom);

  it('adds and removes attribute', async () => {
    let rect = app.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe(null);

    const button = app.querySelector('button');
    button.click();
    await waitForChanges();
    rect = app.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe('rotate(45 27 27)');

    button.click();
    await waitForChanges();
    rect = app.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe(null);
  });
});
