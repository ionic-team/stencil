import { Component, h } from '@stencil/core';

@Component({
  tag: 'text-content-patch',
})
export class TextContentPatch {
  render() {
    return [<p>Top content</p>, <p>Bottom content</p>];
  }
}
