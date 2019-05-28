import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'slot-dynamic-list',
  shadow: true
})
export class DynamicListComponent {
  @Prop() items: Array<string> = [];

  render() {
    return (
      <slot-light-list>
        {this.items.map(item => (
          <div>{item}</div>
        ))}
      </slot-light-list>
    );
  }
}
