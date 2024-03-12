import { setupDomTests, waitForChanges } from '../util';

describe('computed-properties-prop-decorator', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/computed-properties-prop-decorator/index.html');
  });
  afterEach(tearDownDom);

  it('correctly sets computed property `@Prop()`s and triggers re-renders', async () => {
    const el = app.querySelector('computed-properties-prop-decorator');
    expect(el.textContent).toBe('no content');
    const button = app.querySelector('button');
    expect(button).toBeDefined();

    button.click();
    await waitForChanges();
    expect(el.textContent).toBe('These are my props');
  });

  it('has the default value reflected to the correct attribute on the host', async () => {
    const el = app.querySelector('computed-properties-prop-decorator-reflect');

    const firstNameAttr = el.getAttribute('first-name');
    expect(firstNameAttr).toEqual('no');
    const lastNameAttr = el.getAttribute('last-name');
    expect(lastNameAttr).toEqual('content');
  });
});
