import { Component, Prop } from '../../../../dist';

@Component({
  tag: 'attribute-html-root'
})
export class AttributeHtmlRoot {

  @Prop() strAttr: string;
  @Prop() anyAttr: any | null;
  @Prop() nuAttr: number | null;

  render() {
    return [
      <p>strAttr: <strong id="str-attr">{this.strAttr} {typeof this.strAttr}</strong></p>,
      <p>anyAttr: <strong id="any-attr">{this.anyAttr} {typeof this.anyAttr}</strong></p>,
      <p>nuAttr: <strong id="nu-attr">{this.nuAttr} {typeof this.nuAttr}</strong></p>
    ];
  }
}
