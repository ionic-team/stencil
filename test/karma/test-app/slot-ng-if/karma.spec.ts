import { setupDomTests } from '../util';

describe('slot-ng-if', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-ng-if/index.html');
  });
  afterEach(tearDownDom);

  it('renders bound values in slots within ng-if context', async () => {
    const root = app.querySelector('slot-ng-if');
    expect(root.textContent).toBe('Angular Bound Label');
  });
});