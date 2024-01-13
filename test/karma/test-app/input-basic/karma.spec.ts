import { setupDomTests, waitForChanges } from '../util';

describe('input-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/input-basic/index.html');
  });
  afterEach(tearDownDom);

  it('should change value prop both ways', async () => {
    const cmp = app.querySelector('input-basic-root');

    const input = app.querySelector('input');
    expect(input.value).toBe('hello');
    input.value = 'bye';
    expect(input.value).toBe('bye');

    cmp.value = 'value';
    await waitForChanges();
    expect(input.value).toBe('value');
  });
});
