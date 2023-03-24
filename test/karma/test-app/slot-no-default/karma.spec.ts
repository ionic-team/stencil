import { setupDomTests } from '../util';

describe('slot-no-default', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-no-default/index.html');
  });
  afterEach(tearDownDom);

  it('only renders slots that have a location', async () => {
    const root = app.querySelector('slot-no-default');

    const a = root.querySelector('a');
    expect(a.hasAttribute('hidden')).toBe(false);

    const header = root.querySelector('header');
    expect(header.hasAttribute('hidden')).toBe(true);

    const main = root.querySelector('main');
    expect(main.hasAttribute('hidden')).toBe(true);

    const nav = root.querySelector('nav');
    expect(nav.hasAttribute('hidden')).toBe(false);

    const footer = root.querySelector('footer');
    expect(footer.hasAttribute('hidden')).toBe(false);
  });
});
