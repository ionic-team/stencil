const VALIDITY_FLAGS = [
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
] as const;

type ValidityFlag = (typeof VALIDITY_FLAGS)[number];

/**
 * A minimal `ValidityState`: every flag is `false` until `setValidity()` sets it.
 */
export class MockValidityState {
  badInput = false;
  customError = false;
  patternMismatch = false;
  rangeOverflow = false;
  rangeUnderflow = false;
  stepMismatch = false;
  tooLong = false;
  tooShort = false;
  typeMismatch = false;
  valueMissing = false;

  get valid() {
    return VALIDITY_FLAGS.every((flag) => !this[flag]);
  }
}

/**
 * The `ElementInternals` of a form-associated custom element in mock-doc, i.e. in spec tests and
 * in the hydrate app (SSR). There is no form submission or constraint UI on the server, so the
 * methods only keep the state that the component can read back: the form value, the validity and
 * the custom states. ARIA properties (`ariaLabel`, `role`, ...) are plain writable properties.
 */
export class MockElementInternals {
  readonly states = new Set<string>();
  readonly validity = new MockValidityState();
  validationMessage = '';
  role: string | null = null;
  [ariaProperty: `aria${string}`]: string | null | undefined;

  /** The value passed to `setFormValue()`; not part of the `ElementInternals` interface. */
  __formValue: File | string | FormData | null = null;

  constructor(private __host: any) {}

  get form(): any {
    return this.__host.closest('form');
  }

  get labels(): any[] {
    return [];
  }

  get shadowRoot(): any {
    return this.__host.shadowRoot ?? null;
  }

  get willValidate() {
    return true;
  }

  setFormValue(value: File | string | FormData | null, _state?: File | string | FormData | null) {
    this.__formValue = value;
  }

  setValidity(flags: Partial<Record<ValidityFlag, boolean>> = {}, message = '', _anchor?: any) {
    for (const flag of VALIDITY_FLAGS) {
      this.validity[flag] = !!flags[flag];
    }
    this.validationMessage = this.validity.valid ? '' : message;
  }

  checkValidity() {
    return this.validity.valid;
  }

  reportValidity() {
    return this.validity.valid;
  }
}
