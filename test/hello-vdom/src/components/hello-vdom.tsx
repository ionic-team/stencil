import { Component, Method, h } from '@stencil/core';

declare global {
  interface Whatever {

  }
}

@Component({
  tag: 'hello-vdom'
})
export class HelloWorld {

  @Method()
  getTab(tab: string): Promise<Whatever> {
    console.log(tab);
    return null;
  }

  render() {
    return (
      <h1>
        Hello VDOM!</h1>
    );
  }
}
