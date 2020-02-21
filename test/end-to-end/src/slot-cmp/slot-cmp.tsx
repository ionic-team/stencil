import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'slot-cmp',
})
export class SlotCmp {
  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
