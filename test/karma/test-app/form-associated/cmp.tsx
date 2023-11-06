import { Component, h, AttachInternals } from '@stencil/core';

@Component({
  tag: 'form-associated',
  formAssociated: true,
})
export class FormAssociatedCmp {
  @AttachInternals()
  internals: ElementInternals;

  componentWillLoad() {
    this.internals.setFormValue('my default value');
  }

  render() {
    return <input type="text" />;
  }
}
