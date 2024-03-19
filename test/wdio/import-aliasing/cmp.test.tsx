import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

/**
 * Test cases for using import aliases for Stencil decorators. Only
 * tests a subset of all Stencil decorators.
 */
describe('import aliasing', function () {
  beforeEach(() => {
    render({
      template: () => (
        <form>
          <import-aliasing user="John" name="test-input"></import-aliasing>
        </form>
      ),
    });
  });

  it('should render correctly with aliased imports', async () => {
    await $('import-aliasing').waitForExist();

    const host = document.querySelector('import-aliasing');

    expect(host.children[0].textContent).toBe('My name is John');
    expect(host.children[1].textContent).toBe('Name changed 0 time(s)');
    expect(host.children[2].textContent).toBe('Method called 0 time(s)');
    expect(host.children[3].textContent).toBe('Event triggered 0 time(s)');

    host.setAttribute('user', 'Peter');
    await $('import-aliasing').waitForStable();

    expect(host.children[0].textContent).toBe('My name is Peter');
    expect(host.children[1].textContent).toBe('Name changed 1 time(s)');
    expect(host.children[2].textContent).toBe('Method called 0 time(s)');
    expect(host.children[3].textContent).toBe('Event triggered 0 time(s)');

    const el = await host.myMethod();
    await $('import-aliasing').waitForStable();

    expect(el).toBe(host);
    expect(host.children[0].textContent).toBe('My name is Peter');
    expect(host.children[1].textContent).toBe('Name changed 1 time(s)');
    expect(host.children[2].textContent).toBe('Method called 1 time(s)');
    expect(host.children[3].textContent).toBe('Event triggered 1 time(s)');
  });

  it('should link up to the surrounding form', async () => {
    await $('import-aliasing').waitForExist();
    const formEl = document.querySelector('form');
    expect(new FormData(formEl).get('test-input')).toBe('my default value');
  });
});
