import { setupDomTests, waitForChanges } from '../util';

describe('computed-properties-watch-decorator', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/computed-properties-watch-decorator/index.html');
  });
  afterEach(tearDownDom);

  it('triggers the watch callback when the associated prop changes', async () => {
    const el = app.querySelector('computed-properties-watch-decorator');
    expect(el.innerText).toBe('First name called with: not yet\n\nLast name called with: not yet');

    const button = app.querySelector('button');
    expect(button).toBeDefined();

    button.click();
    await waitForChanges();

    const firstNameCalledWith = {
      newVal: 'Bob',
      oldVal: 'no',
      attrName: 'first',
    };
    const lastNameCalledWith = {
      newVal: 'Builder',
      oldVal: 'content',
      attrName: 'last',
    };
    expect(el.innerText).toBe(
      `First name called with: ${JSON.stringify(firstNameCalledWith)}\n\nLast name called with: ${JSON.stringify(
        lastNameCalledWith,
      )}`,
    );
  });
});
