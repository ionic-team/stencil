import { Component, h } from '@stencil/core';

@Component({
  tag: 'hydrated-sibling-accessors',
  scoped: true,
})
export class HydratedSiblingAccessors {
  render() {
    return (
      <div>
        Hidden text Node
        <slot />
        <span>Hidden span element</span>
        <slot name="second-slot">Second slot fallback text</slot>
      </div>
    );
  }
}
