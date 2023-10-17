import { Component, h } from '@stencil/core';

@Component({
  tag: 'drop-down-content',
  shadow: true,
})
export class DropdownContent {
  render() {
    return (
      <div>
        <p>content before</p>
        <slot />
        <p>content after</p>
      </div>
    );
  }
}
