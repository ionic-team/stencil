import { setupDomTests } from '../util';

describe('global script', () => {
  const env = setupDomTests(document);

  afterEach(() => {
    env?.tearDownDom();
  });

  it('supports async execution', async () => {
    await env?.setupDom('/global-script/index.html');

    const cmp = document.querySelector('test-cmp');
    expect(cmp).not.toBeNull();
    expect(typeof cmp?.textContent).toBe('string');

    const renderedDelay = parseInt(cmp?.textContent?.slice('I am rendered after '.length));
    expect(renderedDelay).toBeGreaterThanOrEqual(1000);
  });
});
