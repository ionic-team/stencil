import { Component, Element, h, Host } from '@stencil/core';

@Component({
  tag: 'slot-ref',
  shadow: false,
  scoped: true,
})
export class SlotRef {
  @Element() hostElement: HTMLElement;

  render() {
    return (
      <Host>
        <slot
          name="title"
          ref={(el) => {
            this.hostElement.setAttribute('data-ref-id', el!.id);
            this.hostElement.setAttribute('data-ref-tagname', el!.tagName);
          }}
        />
      </Host>
    );
  }
}
