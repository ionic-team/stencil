import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'scoped-slotted-c',
  styles: `
    :host(.a) ::slotted(p) {
      color: green;
    }
  `,
  scoped: true
})
export class ScopedBasic {

  render() {
    return (
      <Host class="a">
        <div>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
