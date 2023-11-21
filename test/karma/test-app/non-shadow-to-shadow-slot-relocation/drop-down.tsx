import { Component, h } from '@stencil/core';

@Component({
  tag: 'drop-down',
  shadow: true,
})
export class Dropdown {
  render() {
    return (
      <div>
        <p>dropdown before</p>
        <slot name="main-content" />
        <slot name="dropdown-content-element" />
        <p>dropdown after</p>
      </div>
    );
  }
}
