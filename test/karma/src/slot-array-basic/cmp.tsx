import { Component } from '../../../../dist/index';

@Component({
  tag: 'slot-array-basic',
  styleUrl: 'cmp.css',
  shadow: true
})
export class SlotArrayBasic {
  render() {
    return [
      <div class="first">first</div>,
      <slot />,
      <div class="last">last</div>
    ];
  }
}
