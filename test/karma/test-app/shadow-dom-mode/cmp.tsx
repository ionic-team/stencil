import { Component, h, getMode } from '@stencil/core';

@Component({
  tag: 'shadow-dom-mode',
  styleUrls: {
    blue: 'mode-blue.css',
    red: 'mode-red.css'
  },
  shadow: true
})
export class ShadowDomMode {

  private mode = getMode(this);

  render() {
    return <div>{this.mode}</div>;
  }
}
