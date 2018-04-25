import { Component } from '../../../../dist/index';

@Component({
  tag: 'slot-array',
  shadow: true
})
export class SlotArray {

  render() {
    return [
      <span>Content should be on top</span>,
      <slot />
    ]
  }

}
