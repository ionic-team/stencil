import { Component, Host, Prop, getAssetPath, h } from '@stencil/core';

@Component({
  tag: 'cmp-asset'
})
export class CmpAsset {

  @Prop() icon: string;

  render() {
    return (
      <Host>
        <img src={ getAssetPath(`assets/icons/${this.icon}.png`) } />
      </Host>
    );
  }
}
