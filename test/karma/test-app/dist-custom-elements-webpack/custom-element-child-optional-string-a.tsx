import { Component, h } from '@stencil/core';

@Component({
  tag: 'custom-element-child-optional-string-a',
  shadow: true
})
export class CustomElementChildOptionalStringA {
  render() {
    return (
      <div>
        <strong>Optional Nested Component via String A Loaded!</strong>
      </div>
    );
  }
}
