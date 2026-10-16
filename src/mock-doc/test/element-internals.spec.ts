import { MockDocument } from '../document';
import { MockElementInternals } from '../element-internals';

describe('element internals', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument('');
  });

  it('implements the methods of ElementInternals', () => {
    const internals = doc.createElement('my-field').attachInternals();

    expect(internals).toBeInstanceOf(MockElementInternals);
    expect(() => internals.setFormValue('Ada')).not.toThrow();
    expect(internals.__formValue).toBe('Ada');
    expect(internals.willValidate).toBe(true);
    expect(internals.checkValidity()).toBe(true);
    expect(internals.reportValidity()).toBe(true);
  });

  it('keeps the validity set by setValidity()', () => {
    const internals = doc.createElement('my-field').attachInternals();

    internals.setValidity({ valueMissing: true }, 'Please fill in this field.');
    expect(internals.validity.valueMissing).toBe(true);
    expect(internals.validity.valid).toBe(false);
    expect(internals.validationMessage).toBe('Please fill in this field.');
    expect(internals.checkValidity()).toBe(false);

    internals.setValidity({});
    expect(internals.validity.valueMissing).toBe(false);
    expect(internals.validity.valid).toBe(true);
    expect(internals.validationMessage).toBe('');
    expect(internals.checkValidity()).toBe(true);
  });

  it('returns the closest form, the shadow root and no labels', () => {
    const form = doc.createElement('form');
    const host = doc.createElement('my-field');
    form.appendChild(host);
    doc.body.appendChild(form);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const internals = host.attachInternals();

    expect(internals.form).toBe(form);
    expect(internals.shadowRoot).toBe(shadowRoot);
    expect(internals.labels).toEqual([]);
    expect(doc.createElement('my-field').attachInternals().form).toBe(null);
  });

  it('keeps custom states and ARIA properties', () => {
    const internals = doc.createElement('my-field').attachInternals();

    internals.states.add('checked');
    internals.role = 'checkbox';
    internals.ariaChecked = 'true';

    expect(internals.states.has('checked')).toBe(true);
    expect(internals.role).toBe('checkbox');
    expect(internals.ariaChecked).toBe('true');
  });
});
