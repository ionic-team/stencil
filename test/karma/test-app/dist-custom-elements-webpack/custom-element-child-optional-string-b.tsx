import { Component, h } from '@stencil/core';

@Component({
  tag: 'custom-element-child-optional-string-b',
  shadow: true
})
export class CustomElementChildOptionalStringB {
  render() {
    return (
      <div>
        <strong>Optional Nested Component via String B Loaded!</strong>

        <custom-element-nested-child></custom-element-nested-child>
      </div>
    );
  }
}
