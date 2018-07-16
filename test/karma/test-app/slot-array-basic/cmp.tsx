import { Component } from '../../../../dist';

@Component({
  tag: 'slot-array-basic',
  styleUrl: 'cmp.css',
  shadow: false
})
export class SlotArrayBasic {
  render() {
    return [
      <header>Header</header>,
      <slot />,
      <footer>Footer</footer>
    ];
  }
}
