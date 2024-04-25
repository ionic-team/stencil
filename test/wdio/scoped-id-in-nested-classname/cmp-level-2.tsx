import { Component, h } from '@stencil/core';

@Component({
  tag: 'cmp-level-2',
  shadow: false,
  scoped: true,
})
export class CmpLevel2 {
  render() {
    return (
      <cmp-level-3>
        <slot />
      </cmp-level-3>
    );
  }
}
