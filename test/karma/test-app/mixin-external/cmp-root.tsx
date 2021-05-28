import { Component, Mixin, ComponentInterface, h, Prop, VNode } from '@stencil/core';
import { Button } from 'ionic-git/core/src/components/button/button';

@Mixin(Button)
@Component({
  tag: 'mixin-external',
  shadow: true,
  styleUrl: '../../node_modules/ionic-git/core/src/components/button/button.md.scss'
})
export class MixinExternal implements ComponentInterface {
  @Prop() mixinProperty: string = 'This is a local node';

  renderCopy: () => VNode;

  localContent(): VNode {
    return <div>{this.mixinProperty}</div>
  }

  // this is horrid. But it's a demo
  foundVChildren = (item: VNode): any[] => {
    for (const [_key, value] of Object.entries(item)) {
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  constructor() {
    this.renderCopy = this.render.bind(this);
    this.render = () => {
      const ionicContent = this.renderCopy();
      this.foundVChildren(this.foundVChildren(this.foundVChildren(ionicContent)[0])[0]).push(this.localContent());
      return ionicContent;
    }
  }
}
export interface MixinExternal extends Button{}
