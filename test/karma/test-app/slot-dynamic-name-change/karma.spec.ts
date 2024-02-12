import { setupDomTests, waitForChanges } from '../util';

/**
 * Tests the case where a `slot` element in a component has its
 * `name` attribute changed dynamically via a property.
 */
describe('slot dynamic name change', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-dynamic-name-change/index.html');
  });

  afterEach(tearDownDom);

  it('should change the slot name for a shadow component', async () => {
    const cmp = app.querySelector('slot-dynamic-name-change-shadow');
    expect(cmp.innerText).toBe('Hello');
    expect(cmp.shadowRoot.querySelector('slot').getAttribute('name')).toBe('greeting');

    app.querySelector('button').click();
    await waitForChanges();

    expect(cmp.innerText).toBe('Goodbye');
    expect(cmp.shadowRoot.querySelector('slot').getAttribute('name')).toBe('farewell');
  });

  it('should change the slot name for a scoped component', async () => {
    const cmp = app.querySelector('slot-dynamic-name-change-scoped');
    expect(cmp.innerText).toBe('Hello');
    expect(cmp.querySelector('p:not([hidden])').getAttribute('slot')).toBe('greeting');

    app.querySelector('button').click();
    await waitForChanges();

    expect(cmp.innerText).toBe('Goodbye');
    expect(cmp.querySelector('p:not([hidden])').getAttribute('slot')).toBe('farewell');
  });
});
