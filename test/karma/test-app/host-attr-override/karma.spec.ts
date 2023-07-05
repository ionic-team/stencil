import { setupDomTests } from '../util';

describe('host attribute overrides', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/host-attr-override/index.html');
  });
  afterEach(tearDownDom);

  it('should merge class set in HTML with that on the Host', async () => {
    expect(app.querySelector('.default.override')).not.toBeNull();
  });

  it('should override non-class attributes', () => {
    expect(app.querySelector('.with-role').getAttribute('role')).toBe('another-role');
  });
});
