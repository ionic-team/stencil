import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-simple',
  shadow: false,
})
export class MySimple {
  render() {
    return <span>simple!</span>;
  }
}
