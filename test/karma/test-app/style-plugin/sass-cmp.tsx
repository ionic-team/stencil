import { Component } from '../../../../dist';

@Component({
  tag: 'sass-cmp',
  styleUrl: 'sass-entry.scss'
})
export class SassCmp {

  render() {
    return [
      <div class="sass-entry">Sass Entry</div>,
      <div class="sass-importee">Sass Importee</div>,
      <div class="css-importee">Css Importee</div>
    ];
  }
}
