import { Component, Prop } from '../../../../dist/index';


@Component({
  tag: 'slot-reorder',
})
export class SlotReorder {
  @Prop() reordered = false;

  render(): JSX.Element {
    if (this.reordered) {
      return (
        <div class='reordered'>
          <slot name='slot-b'><div>fallback slot-b</div></slot>
          <slot><div>fallback default</div></slot>
          <slot name='slot-a'><div>fallback slot-a</div></slot>
        </div>
      );
    }

    return (
      <div>
        <slot><div>fallback default</div></slot>
        <slot name='slot-a'><div>fallback slot-a</div></slot>
        <slot name='slot-b'><div>fallback slot-b</div></slot>
      </div>
    );
  }
}
