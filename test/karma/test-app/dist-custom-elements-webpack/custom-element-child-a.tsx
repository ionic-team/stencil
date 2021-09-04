import { Component, h } from '@stencil/core';

@Component({
  tag: 'custom-element-child-a',
  shadow: true
})
export class CustomElementChildA {
  render() {
    return (
      <div>
        <strong>Basic Nested Component Loaded!</strong>
      </div>
    );
  }
}
