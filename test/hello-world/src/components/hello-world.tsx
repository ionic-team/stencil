import { Component } from '@stencil/core';

@Component({
  tag: 'hello-world'
})
export class HelloWorld {

  private value = 11;
  render() {
    console.log('holas');
    return (
      'Hello World' + this.value
    );
  }
}
