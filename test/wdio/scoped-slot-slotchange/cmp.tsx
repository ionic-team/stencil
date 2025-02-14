import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'scoped-slot-slotchange',
  scoped: true,
})
export class ScopedSlotChange {
  @Prop({ mutable: true }) slotEventCatch: { event: Event; assignedNodes: Node[] }[] = [];

  private handleSlotchange = (e) => {
    this.slotEventCatch.push({ event: e, assignedNodes: e.target.assignedNodes({ flatten: true }) });
  };

  render() {
    return (
      <div>
        <slot onSlotchange={this.handleSlotchange} />
      </div>
    );
  }
}
