import { Component, Mixin, Prop, ComponentInterface, Element } from '@stencil/core';
import ToMixin from './to-mixin-plain';
import { ToMixin as ToMixinCmp } from './to-mixin-cmp';

@Mixin(ToMixinCmp)
@Mixin(ToMixin)
@Component({
  tag: 'mixin-cmp',
  shadow: true,
})
export class MixinCmp implements ComponentInterface {
  @Prop() firstName = 'Jonny';

  @Element() el!: HTMLElement;

  componentDidLoad() {
    const div = document.createElement('div');
    div.innerHTML = `${this.firstName} ${this.middleName} ${this.surname}`;
    // @ts-ignore
    for (const [key, value] of Object.entries(css)) {
      div.setAttribute('style', `${key}: ${value};`);
    }
    this.el.append(div);
  }
}
export interface MixinCmp extends Omit<ToMixinCmp, 'firstName' | 'render'>, ToMixin {}
