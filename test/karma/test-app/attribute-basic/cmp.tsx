import { Component, Prop } from '../../../../dist/index';

@Component({
  tag: 'attribute-basic'
})
export class AttributeBasic {

  @Prop() single = 'single';
  @Prop() multiWord = 'multiWord';
  @Prop({ attr: 'my-custom-attr' }) customAttr = 'my-custom-attr';

  render() {
    return (
      <div>
        <div class="single">
          {this.single}
        </div>
        <div class="multiWord">
          {this.multiWord}
        </div>
        <div class="customAttr">
          {this.customAttr}
        </div>
      </div>
    );
  }
}
