import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'less-cmp',
  styleUrl: 'less-entry.less',
  shadow: true,
})
export class LessCmp {
  render() {
    return (
      <Host>
        <div class="less-entry">Less Entry</div>
        <div class="less-importee">Less Importee</div>
        <div class="css-importee">Css Importee</div>
        <hr />
      </Host>
    );
  }
}
