import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'slot-list-light-root'
})
export class AppHome {
  @Prop({ mutable: true })
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  needMore() {
    const newItems = [
      `Item ${this.items.length + 1}`,
      `Item ${this.items.length + 2}`,
      `Item ${this.items.length + 3}`,
      `Item ${this.items.length + 4}`
    ];

    this.items = [...this.items, ...newItems];
  }

  render() {
    return (
      <div>
        <slot-dynamic-list items={this.items} />
        <button onClick={() => this.needMore()}>More</button>
      </div>
    );
  }
}
