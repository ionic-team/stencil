import { setupDomTests } from '../util';

describe('static-members', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/static-members/index.html');
  });
  afterEach(tearDownDom);

  it('renders properly with initialized static members', async () => {
    const cmp = app.querySelector('static-members');

    expect(cmp.textContent.trim()).toBe('This is a component with static public and private members');
  });

  it('renders properly with a separate export', async () => {
    const cmp = app.querySelector('static-members-separate-export');

    expect(cmp.textContent.trim()).toBe('This is a component with static public and private members');
  });

  it('renders properly with a static member initialized outside of a class', async () => {
    const cmp = app.querySelector('static-members-separate-initializer');

    expect(cmp.textContent.trim()).toBe('This is a component with static an externally initialized member');
  });
});
