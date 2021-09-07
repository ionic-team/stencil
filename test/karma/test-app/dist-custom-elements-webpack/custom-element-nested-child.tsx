import { Component, h } from '@stencil/core';

@Component({
  tag: 'custom-element-nested-child',
  shadow: true
})
export class CustomElementNestedChild {
  render() {
    return (
      <div>
        <strong>Nested child Loaded!</strong>
      </div>
    );
  }
}
