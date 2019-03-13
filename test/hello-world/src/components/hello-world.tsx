import { Component } from '@stencil/core';

@Component({
  tag: 'hello-world'
})
export class HelloWorld {

  private valuek = 12;
  render() {
    return (
      'Hello World' + this.valuek
    );
  }
}
