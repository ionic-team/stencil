import { Component } from '@stencil/core';

@Component({
  tag: 'shadow-dom-slot-basic',
  styles: `
    :host {
      color: red;
    }
  `,
  shadow: true,
})
export class ShadowDomSlotBasic {}
