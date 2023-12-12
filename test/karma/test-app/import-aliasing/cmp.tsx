import { Component as Cmp, h, Prop as Input, State as StencilState, Watch as StencilWatch } from '@stencil/core';

@Cmp({
  tag: 'import-aliasing',
})
export class FormAssociatedCmp {
  @Input() name: string;

  @StencilWatch('name')
  onNameChange() {
    this.changeCount += 1;
  }

  @StencilState() changeCount = 0;

  render() {
    return [<p>My name is {this.name}</p>, <p>Name changed {this.changeCount} time(s)</p>];
  }
}
