import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'scoped-slotted-a',
  styles: `
    :host(.a) ::slotted(p) {
      color: blue;
    }
  `,
  scoped: true
})
export class ScopedBasic {

  render() {
    return (
      <Host class="a"></Host>
    );
  }

}
