import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'stylus-cmp',
  styleUrl: 'stylus-entry.styl',
  shadow: true,
})
export class StylusCmp {
  render() {
    return (
      <Host>
        <div class="stylus-entry">Stylus Entry</div>
        <div class="stylus-importee">Stylus Importee</div>
        <div class="css-importee">Css Importee</div>
        <hr />
      </Host>
    );
  }
}
