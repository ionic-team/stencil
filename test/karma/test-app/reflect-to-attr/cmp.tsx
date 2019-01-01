import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'reflect-to-attr'
})
export class ReflectToAttr {

  @Element() el: any;

  @Prop({reflectToAttr: true}) str = 'single';
  @Prop({reflectToAttr: true}) nu = 2;
  @Prop({reflectToAttr: true}) undef: string;
  @Prop({reflectToAttr: true}) null: string = null;
  @Prop({reflectToAttr: true}) bool = false;
  @Prop({reflectToAttr: true}) otherBool = true;

  @Prop({reflectToAttr: true, mutable: true}) dynamicStr: string;
  @Prop({reflectToAttr: true}) dynamicNu: number;

  componentDidLoad() {
    this.dynamicStr = 'value';
    this.el.dynamicNu = 123;
  }

}
