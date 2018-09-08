import { Component } from '../../../../dist';

@Component({
  tag: 'css-cmp',
  styleUrl: 'css-entry.css'
})
export class CssCmp {

  render() {
    return [
      <div class="css-entry">Css Entry</div>,
      <div class="css-importee">Css Importee</div>
    ];
  }
}
