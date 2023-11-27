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

  formAssociatedCallback(form: HTMLFormAssociatedElement) {
    form.ariaLabel = 'formAssociated called';
    // this is a regression test for #5106 which ensures that `this` is
    // resolved correctly
    this.internals.setValidity({});
  }

  render() {
    return <input type="text" />;
  }
}
