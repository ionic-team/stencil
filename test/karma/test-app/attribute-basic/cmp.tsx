import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'attribute-basic',
})
export class AttributeBasic {
  @Prop() single = 'single';
  @Prop() multiWord = 'multiWord';
  @Prop({ attribute: 'my-custom-attr' }) customAttr = 'my-custom-attr';

  render() {
    return (
      <div>
        <div class="single">{this.single}</div>
        <div class="multiWord">{this.multiWord}</div>
        <div class="customAttr">{this.customAttr}</div>
        <div>
          <label class="htmlForLabel" htmlFor={'a'}>
            htmlFor
          </label>
          <input type="checkbox" id={'a'}></input>
        </div>
      </div>
    );
  }
}
