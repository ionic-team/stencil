import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'slot-parent-cmp'
})
export class SlotParentCmp {
  render() {
    return (
      <Host>
        <slot-cmp>
          <slot />
        </slot-cmp>
      </Host>
    )
  }
}
