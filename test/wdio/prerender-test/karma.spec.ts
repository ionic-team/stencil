import { setupDomTests, waitForChanges } from '../util';

/**
 * This monkey-patches `window.console.error` in order to fail a test if that
 * function is called within a test.
 *
 * @returns a teardown function which ondoes the monkey-patch
 */
function patchConsoleError() {
  const orgConsoleError = window.console.error;

  window.console.error = function (...args: any[]) {
    orgConsoleError.apply(window, args);
    window.console.info('console.error', args);
    throw new Error('console.error was called, this is not allowed in a unit test run');
  };

  return () => {
    window.console.error = orgConsoleError;
  };
}

describe('prerender', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;
  afterEach(tearDownDom);

  it('server componentWillLoad Order', async () => {
    app = await setupDom('/prerender/index.html', 500);
    const elm = app.querySelector('#server-componentWillLoad');
    expect(elm.children[0].textContent.trim()).toBe('CmpA server componentWillLoad');
    expect(elm.children[1].textContent.trim()).toBe('CmpD - a1-child server componentWillLoad');
    expect(elm.children[2].textContent.trim()).toBe('CmpD - a2-child server componentWillLoad');
    expect(elm.children[3].textContent.trim()).toBe('CmpD - a3-child server componentWillLoad');
    expect(elm.children[4].textContent.trim()).toBe('CmpD - a4-child server componentWillLoad');
    expect(elm.children[5].textContent.trim()).toBe('CmpB server componentWillLoad');
    expect(elm.children[6].textContent.trim()).toBe('CmpC server componentWillLoad');
    expect(elm.children[7].textContent.trim()).toBe('CmpD - c-child server componentWillLoad');
  });

  it('server componentDidLoad Order', async () => {
    app = await setupDom('/prerender/index.html', 500);
    const elm = app.querySelector('#server-componentDidLoad');
    expect(elm.children[0].textContent.trim()).toBe('CmpD - a1-child server componentDidLoad');
    expect(elm.children[1].textContent.trim()).toBe('CmpD - a2-child server componentDidLoad');
    expect(elm.children[2].textContent.trim()).toBe('CmpD - a3-child server componentDidLoad');
    expect(elm.children[3].textContent.trim()).toBe('CmpD - a4-child server componentDidLoad');
    expect(elm.children[4].textContent.trim()).toBe('CmpD - c-child server componentDidLoad');
    expect(elm.children[5].textContent.trim()).toBe('CmpC server componentDidLoad');
    expect(elm.children[6].textContent.trim()).toBe('CmpB server componentDidLoad');
    expect(elm.children[7].textContent.trim()).toBe('CmpA server componentDidLoad');
  });

  it('correct scoped styles applied after scripts kick in', async () => {
    app = await setupDom('/prerender/index.html', 500);
    testScopedStyles(app);
  });

  it('no-script, correct scoped styles applied before scripts kick in', async () => {
    app = await setupDom('/prerender/index-no-script.html', 500);
    testScopedStyles(app);
  });

  it('root slots', async () => {
    app = await setupDom('/prerender/index.html');
    await waitForChanges(500);

    const scoped = app.querySelector('cmp-client-scoped');
    const scopedStyle = getComputedStyle(scoped.querySelector('section'));
    expect(scopedStyle.color).toBe('rgb(255, 0, 0)');

    const shadow = app.querySelector('cmp-client-shadow');
    const shadowStyle = getComputedStyle(shadow.shadowRoot.querySelector('article'));
    expect(shadowStyle.color).toBe('rgb(0, 155, 0)');

    const blueText = shadow.shadowRoot.querySelector('cmp-text-blue');
    const blueTextStyle = getComputedStyle(blueText.querySelector('text-blue'));
    expect(blueTextStyle.color).toBe('rgb(0, 0, 255)');

    const greenText = shadow.shadowRoot.querySelector('cmp-text-green');
    const greenTextStyle = getComputedStyle(greenText.querySelector('text-green'));
    expect(greenTextStyle.color).toBe('rgb(0, 255, 0)');
  });

  // this describe block is just here to let us run a cleanup function after
  // the test exits, whether or not it fails
  describe('should render an svg child', () => {
    const teardown = patchConsoleError();
    afterAll(teardown);

    it('should render an svg child', async () => {
      app = await setupDom('/prerender/index.html');
      await waitForChanges(500);

      const testSvg = app.querySelector('test-svg');
      expect(testSvg.className).toBe('hydrated');
    });
  });
});

function testScopedStyles(app: HTMLElement) {
  const cmpScopedA = app.querySelector('cmp-scoped-a');
  const scopedAStyles = window.getComputedStyle(cmpScopedA);
  expect(scopedAStyles.backgroundColor).toBe('rgb(0, 128, 0)');

  const cmpScopedADiv = cmpScopedA.querySelector('div');
  const scopedADivStyles = window.getComputedStyle(cmpScopedADiv);
  expect(scopedADivStyles.fontSize).toBe('14px');

  const cmpScopedAP = cmpScopedA.querySelector('p');
  const scopedAPStyles = window.getComputedStyle(cmpScopedAP);
  expect(scopedAPStyles.color).toBe('rgb(128, 0, 128)');

  const cmpScopedAScopedClass = cmpScopedA.querySelector('.scoped-class');
  const scopedAScopedClassStyles = window.getComputedStyle(cmpScopedAScopedClass);
  expect(scopedAScopedClassStyles.color).toBe('rgb(0, 0, 255)');

  const cmpScopedB = app.querySelector('cmp-scoped-b');
  const scopedBStyles = window.getComputedStyle(cmpScopedB);
  expect(scopedBStyles.backgroundColor).toBe('rgb(128, 128, 128)');

  const cmpScopedBDiv = cmpScopedB.querySelector('div');
  const scopedBDivStyles = window.getComputedStyle(cmpScopedBDiv);
  expect(scopedBDivStyles.fontSize).toBe('18px');

  const cmpScopedBP = cmpScopedB.querySelector('p');
  const scopedBPStyles = window.getComputedStyle(cmpScopedBP);
  expect(scopedBPStyles.color).toBe('rgb(0, 128, 0)');

  const cmpScopedBScopedClass = cmpScopedB.querySelector('.scoped-class');
  const scopedBScopedClassStyles = window.getComputedStyle(cmpScopedBScopedClass);
  expect(scopedBScopedClassStyles.color).toBe('rgb(255, 255, 0)');
}
