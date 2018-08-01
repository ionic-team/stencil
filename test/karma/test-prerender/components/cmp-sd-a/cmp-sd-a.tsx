import { Component } from '../../../../../dist';


@Component({
  tag: 'cmp-sd-a',
  styleUrl: 'cmp-sd-a.css',
  scoped: true
})
export class CmpSdA {

  render() {
    return (
      <div>
        <p>
          <slot></slot>
        </p>
        <slot name="slot-left"></slot>
        <p class="scoped-class">sd-class</p>
        <slot name="slot-right"></slot>
      </div>
    );
  }
}
