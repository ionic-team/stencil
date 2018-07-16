import { Component } from '../../../../dist';

@Component({
  tag: 'slot-basic-order'
})
export class SlotBasicOrder {

  render() {
    return <slot></slot>
  }

}
