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
    expect(host.children[2].textContent).toBe('Method called 0 time(s)');
    expect(host.children[3].textContent).toBe('Event triggered 0 time(s)');

    host.setAttribute('user', 'Peter');
    await waitForChanges();

    expect(host.children[0].textContent).toBe('My name is Peter');
    expect(host.children[1].textContent).toBe('Name changed 1 time(s)');
    expect(host.children[2].textContent).toBe('Method called 0 time(s)');
    expect(host.children[3].textContent).toBe('Event triggered 0 time(s)');

    const el = await host.myMethod();
    await waitForChanges();

    expect(el).toBe(host);
    expect(host.children[0].textContent).toBe('My name is Peter');
    expect(host.children[1].textContent).toBe('Name changed 1 time(s)');
    expect(host.children[2].textContent).toBe('Method called 1 time(s)');
    expect(host.children[3].textContent).toBe('Event triggered 1 time(s)');
  });

  it('should link up to the surrounding form', async () => {
    const formEl = app.querySelector('form');
    expect(new FormData(formEl).get('test-input')).toBe('my default value');
  });
});
