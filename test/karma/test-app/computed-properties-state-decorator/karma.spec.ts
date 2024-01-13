import { setupDomTests, waitForChanges } from '../util';

describe('computed-properties-state-decorator', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/computed-properties-state-decorator/index.html');
  });
  afterEach(tearDownDom);

  it('correctly sets computed property `@State()`s and triggers re-renders', async () => {
    const el = app.querySelector('computed-properties-state-decorator');
    expect(el.innerText).toBe('Has rendered: false\n\nMode: default');

    const button = app.querySelector('button');
    expect(button).toBeDefined();

    button.click();
    await waitForChanges();

    expect(el.innerText).toBe('Has rendered: true\n\nMode: super');
  });
});
