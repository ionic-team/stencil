import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'slot-nested-name-change',
})
export class SlotNestedNameChange {
  render() {
    return (
      <Host>
        <div>
          <slot-nested-name-change-child state={true}>
            <slot slot="default" />
          </slot-nested-name-change-child>
        </div>
      </Host>
    );
  }
}
