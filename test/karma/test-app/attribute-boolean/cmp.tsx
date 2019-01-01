import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'attribute-boolean'
})
export class AttributeBoolean {

  @Prop({ reflectToAttr: true }) boolState: boolean;
  @Prop({ reflectToAttr: true }) strState: string;
  @Prop() noreflect: boolean;
}
