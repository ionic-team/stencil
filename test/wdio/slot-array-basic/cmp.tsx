import { Component, h } from '@stencil/core';

@Component({
  tag: 'slot-array-basic',
  shadow: false,
})
export class SlotArrayBasic {
  render() {
    return [<header>Header</header>, <slot />, <footer>Footer</footer>];
  }
}
