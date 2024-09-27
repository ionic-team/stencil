import { Component, h } from '@stencil/core';

@Component({
  tag: 'nested-cmp-parent',
  shadow: true,
})
export class NestedCmpParent {
  render() {
    return (
      <div class="some-class">
        <slot></slot>
      </div>
    );
  }
}
