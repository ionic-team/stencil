import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'shadow-dom-mode',
  styleUrls: {
    blue: 'mode-blue.css',
    red: 'mode-red.css'
  },
  shadow: true
})
export class ShadowDomMode {

  @Prop() mode: string;

  render() {
    return <div>{this.mode}</div>;
  }

}
