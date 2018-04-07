import { Component, Prop } from '../../../../dist/index';

@Component({
  tag: 'attribute-basic'
})
export class AttributeBasic {

  @Prop() single: string;
  @Prop() multiWord: string;
  @Prop({ attr: 'my-custom-attr' }) customAttr: string;

  render() {
    return (
      <div>
        <div class="single">
          single: {this.single}
        </div>
        <div class="multiWord">
          multiWord: {this.multiWord}
        </div>
        <div class="customAttr">
          customAttr: {this.customAttr}
        </div>
      </div>
    );
  }

}
