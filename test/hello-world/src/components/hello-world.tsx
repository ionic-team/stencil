import { Component, Prop, State, Method } from '@stencil/core';

@Component({
  tag: 'hello-world'
})
export class HelloWorld {

  @Prop({reflectToAttr: true}) hola: string;
  @State() state: string;
  @Method()
  thisMethod() {

  }
  render() {
    return (
      'Hello World'
    );
  }
}
