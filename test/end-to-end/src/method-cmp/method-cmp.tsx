import { Component, Method, Prop } from '@stencil/core';

@Component({
  tag: 'method-cmp',
})
export class MethodCmp {
  @Prop() someProp = 0;

  @Method()
  async someMethod() {
    return this.someProp;
  }

  @Method()
  async someMethodWithArgs(unit: string, value: number) {
    return `${value} ${unit}`;
  }
}
