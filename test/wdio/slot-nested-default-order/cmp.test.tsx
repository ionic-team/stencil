import { setupDomTests } from '../util';

describe('slot-nested-default-order', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/slot-nested-default-order/index.html');
    host = app.querySelector('slot-nested-default-order-parent');
  });

  afterEach(tearDownDom);

  it('should render', () => {
    expect(host).toBeDefined();
  });

  it('should render the slot content after the div', () => {
    const childCmp = host.querySelector('slot-nested-default-order-child');

    expect(childCmp.children.length).toBe(2);

    const firstChild = childCmp.children[0];
    expect(firstChild.tagName).toBe('DIV');
    expect(firstChild.textContent.trim()).toBe('State: true');

    const secondChild = childCmp.children[1];
    expect(secondChild.tagName).toBe('P');
    expect(secondChild.textContent.trim()).toBe('Hello');
  });
});
