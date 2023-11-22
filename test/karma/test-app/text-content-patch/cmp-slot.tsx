import { Component, h } from '@stencil/core';

@Component({
  tag: 'text-content-patch-with-slot',
})
export class TextContentPatchWithSlot {
  render() {
    return [<p>Top content</p>, <slot></slot>, <p>Bottom content</p>];
  }
}
