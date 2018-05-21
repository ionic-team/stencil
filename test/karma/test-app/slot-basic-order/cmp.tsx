import { Component } from '../../../../dist/index';

@Component({
  tag: 'slot-basic-order'
})
export class SlotBasicOrder {

  render() {
    return <slot></slot>
  }

}
