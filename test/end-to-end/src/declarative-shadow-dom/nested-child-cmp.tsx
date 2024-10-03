import { Component, h } from '@stencil/core';

@Component({
  tag: 'nested-cmp-child',
  shadow: true,
  styleUrl: `nested-child-cmp.css`,
})
export class NestedCmpChild {
  render() {
    return (
      <div class="some-other-class">
        <slot></slot>
      </div>
    );
  }
}
