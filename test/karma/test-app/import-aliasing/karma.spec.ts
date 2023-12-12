import { setupDomTests, waitForChanges } from '../util';

/**
 * Test cases for using import aliases for Stencil decorators. Only
 * tests a subset of all Stencil decorators.
 */
describe('import aliasing', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/import-aliasing/index.html', 500);
  });

  afterEach(tearDownDom);

  it('should render correctly with alised imports', async () => {
    const host = app.querySelector('import-aliasing');

    expect(host.children[0].textContent).toBe('My name is John');
    expect(host.children[1].textContent).toBe('Name changed 0 time(s)');

    host.setAttribute('name', 'Peter');
    await waitForChanges();

    expect(host.children[0].textContent).toBe('My name is Peter');
    expect(host.children[1].textContent).toBe('Name changed 1 time(s)');
  });
});
