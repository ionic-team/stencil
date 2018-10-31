import { Component } from '../../../../dist';

@Component({
  tag: 'slot-light-list'
})
export class SlotLightList {
  render() {
    return [
      <h1>These are my items:</h1>,
      <div class="list-wrapper" style={{ display: 'block', border: '1px solid red' }}>
        <slot></slot>
      </div>,
      <div>That's it....</div>
    ];
  }
}
