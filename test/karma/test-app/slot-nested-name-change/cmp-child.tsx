import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'slot-nested-name-change-child',
})
export class SlotNestedNameChangeChild {
  @Prop() state: boolean;

  render() {
    return (
      <Host>
        <div>State: {this.state.toString()}</div>
        <slot name="default" />
      </Host>
    );
  }
}
