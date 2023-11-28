import { setupDomTests } from '../util';

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('form associated', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/form-associated/index.html', 500);
  });
  afterEach(tearDownDom);

  it('should render without errors', async () => {
    const elm = app.querySelector('form-associated');
    expect(elm).not.toBeNull();
  });

  describe('form associated custom element lifecycle callback', () => {
    it('should trigger "formAssociated"', async () => {
      const formEl = app.querySelector('form');
      expect(formEl.ariaLabel).toBe('formAssociated called');
    });

    it('should trigger "formResetCallback"', async () => {
      const resetBtn: HTMLInputElement = app.querySelector('input[type="reset"]');
      resetBtn.click();

      await sleep(100)

      const formEl = app.querySelector('form');
      expect(formEl.ariaLabel).toBe('formResetCallback called');
    });

    it('should trigger "formDisabledCallback"', async () => {
      const elm = app.querySelector('form-associated');
      const formEl = app.querySelector('form');

      elm.setAttribute('disabled', 'disabled');
      await sleep(100)
      expect(formEl.ariaLabel).toBe('formDisabledCallback called with true');

      elm.removeAttribute('disabled');
      await sleep(100)
      expect(formEl.ariaLabel).toBe('formDisabledCallback called with false');
    });
  });

  it('should link up to the surrounding form', async () => {
    const formEl = app.querySelector('form');
    // this shows that the element has, through the `ElementInternals`
    // interface, been able to set a value in the surrounding form
    expect(new FormData(formEl).get('test-input')).toBe('my default value');
  });
});
