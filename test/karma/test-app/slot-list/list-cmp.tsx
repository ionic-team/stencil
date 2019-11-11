import { Component, h } from '@stencil/core';

@Component({
  tag: 'slot-light-list'
})
export class SlotLightList {
  render() {
    return [
      <section>These are my items:</section>,
      <article class="list-wrapper" style={{ display: 'block', border: '1px solid red' }}>
        <slot></slot>
      </article>,
      <div>That's it....</div>
    ];
  }
}
