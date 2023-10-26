import { setupDomTests } from '../util';

describe('slot-nested-name-change', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/slot-nested-name-change/index.html');
    host = app.querySelector('slot-nested-name-change');
  });

  afterEach(tearDownDom);

  it('should render', () => {
    expect(host).toBeDefined();
  });

  it('should correctly render the slot content', () => {
    const childCmp = host.querySelector('slot-nested-name-change-child');

    expect(childCmp.children.length).toBe(2);

    const firstChild = childCmp.children[0];
    expect(firstChild.tagName).toBe('DIV');
    expect(firstChild.textContent.trim()).toBe('State: true');

    const secondChild = childCmp.children[1];
    expect(secondChild.tagName).toBe('P');
    expect(secondChild.textContent.trim()).toBe('Hello');
  });
});
