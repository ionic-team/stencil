import { Component, Prop, Method } from '@stencil/core';
import { SomeTypes } from '../util';

@Component({
  tag: 'attribute-complex',
})
export class AttributeComplex {
  @Prop() nu0 = 1;
  @Prop() nu1?: number;
  @Prop() nu2?: SomeTypes.Number;

  @Prop() bool0 = true;
  @Prop() bool1?: boolean;
  @Prop() bool2?: boolean;

  @Prop() str0 = 'hello';
  @Prop() str1?: string;
  @Prop() str2?: SomeTypes.String;

  @Method()
  async getInstance() {
    return this;
  }
}
