import { Component, h } from '@stencil/core';

@Component({
  tag: 'stylus-cmp',
  styleUrl: 'stylus-entry.styl'
})
export class StylusCmp {
  render() {
    return [
      <div class="stylus-entry">Stylus Entry</div>,
      <div class="stylus-importee">Stylus Importee</div>,
      <div class="css-importee">Css Importee</div>
    ];
  }
}
