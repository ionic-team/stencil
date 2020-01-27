import { Component } from '@stencil/core';
import { HelloWorldText } from 'hello-world-text';

@Component({
  tag: 'hello-world'
})
export class HelloWorld {
  render() {
    return HelloWorldText;
  }
}
