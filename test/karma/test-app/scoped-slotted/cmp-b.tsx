import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'scoped-slotted-b',
  styles: `
    :host(.a) ::slotted(p) {
      color: red;
    }
  `,
  scoped: true
})
export class ScopedBasic {

  render() {
    return (
      <Host class="a">
        <slot></slot>
      </Host>
    );
  }

}
