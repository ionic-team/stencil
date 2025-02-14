import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'scoped-slot-slotchange-wrap',
  scoped: true,
})
export class ScopedSlotChangeWrap {
  @Prop() swapSlotContent: boolean = false;

  render() {
    return (
      <div>
        <scoped-slot-slotchange>
          {this.swapSlotContent ? <div>Swapped slotted content</div> : <span>Initial slotted content</span>}
        </scoped-slot-slotchange>
      </div>
    );
  }
}
