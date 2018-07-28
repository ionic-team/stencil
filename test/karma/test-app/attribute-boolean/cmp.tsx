import { Component, Prop } from '../../../../dist';

@Component({
  tag: 'attribute-boolean'
})
export class AttributeBoolean {

  @Prop({ reflectToAttr: true }) boolState: boolean;
  @Prop({ reflectToAttr: true }) strState: string;
  @Prop() noreflect: boolean;
}
