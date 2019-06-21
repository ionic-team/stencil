import { Component, h } from '@stencil/core';

@Component({
  tag: 'less-cmp',
  styleUrl: 'less-entry.less'
})
export class LessCmp {

  render() {
    return [
      <div class="less-entry">Less Entry</div>,
      <div class="less-importee">Less Importee</div>,
      <div class="css-importee">Css Importee</div>
    ];
  }
}
