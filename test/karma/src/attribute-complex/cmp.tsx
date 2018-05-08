import { Component, Prop, Method } from '../../../../dist/index';

@Component({
  tag: 'attribute-complex'
})
export class AttributeComplex {

  @Prop() nu0 = 1;
  @Prop() nu1: number;

  @Prop() bool0 = true;
  @Prop() bool1: boolean;
  @Prop() bool2: boolean;

  @Prop() str0 = 'hello';
  @Prop() str1: string;

  @Method()
  getInstance() {
    return this;
  }
}
