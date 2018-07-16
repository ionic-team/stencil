import { Component } from '../../../../dist';


@Component({
  tag: 'slot-map-order-root'
})
export class SlotMapOrderRoot {

  render() {
    const items = ['a', 'b', 'c']

    return <slot-map-order>
      {items.map(item =>
        <div><input type="text" value={item}/></div>
      )}
    </slot-map-order>
  }

}
