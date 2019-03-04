import { Component, h } from '@stencil/core';

@Component({
  tag: 'hello-vdom'
})
export class HelloWorld {

  render() {
    return (
      <h1>Hello VDOM</h1>
    );
  }
}
