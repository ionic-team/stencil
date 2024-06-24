import { Component, h } from '@stencil/core';

@Component({
  tag: 'scoped-basic',
  styles: `
    :host {
      display: block;
      background: black;
      color: grey;
    }

    div {
      color: red;
    }

    ::slotted(span) {
      color: yellow;
    }
  `,
  scoped: true,
})
export class ScopedBasic {
  render() {
    return [
      <div>scoped</div>,
      <p>
        <slot />
      </p>,
    ];
  }
}
