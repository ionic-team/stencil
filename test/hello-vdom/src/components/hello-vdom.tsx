import { Component, h } from '@stencil/core';

@Component({
  tag: 'hello-vdom'
})
export class HelloWorld {

  render() {
    return (
      <h1>
        <hello-vdom about="2"></hello-vdom>
        Hello VDOM</h1>
    );
  }
}
