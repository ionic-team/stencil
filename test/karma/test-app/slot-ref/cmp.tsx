import { Component, Element, h, Host } from '@stencil/core';

@Component({
  tag: 'slot-ref',
  shadow: false,
  scoped: true
})
export class SlotRef {
  @Element() hostElement: HTMLElement;

  render() {
    return (
      <Host>
        <slot name="title" ref={() => (this.hostElement.setAttribute('data-ref', 'called'))} />
      </Host>
    );
  }
}
