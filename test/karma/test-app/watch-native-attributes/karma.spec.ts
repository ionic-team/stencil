import { setupDomTests, waitForChanges } from '../util';

describe('watch native attributes', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/watch-native-attributes/index.html');
  });
  afterEach(tearDownDom);

  it('triggers the callback for the watched attribute', async () => {
    const cmp = app.querySelector('watch-native-attributes');
    expect(cmp.innerText).toBe('Label: myStartingLabel\n\nCallback triggered: false');

    cmp.setAttribute('aria-label', 'myNewLabel');
    await waitForChanges();

    expect(cmp.innerText).toBe('Label: myNewLabel\n\nCallback triggered: true');
  });
});
