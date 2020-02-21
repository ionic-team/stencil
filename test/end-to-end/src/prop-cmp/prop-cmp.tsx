import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'prop-cmp',
  styleUrls: {
    ios: 'prop-cmp.ios.css',
    md: 'prop-cmp.md.css',
  },
  shadow: true
})
export class PropCmp {
  @Prop() first: string;
  @Prop() lastName: string;

  render() {
    return (
      <Host>
        <div>
          Hello, my name is {this.first} {this.lastName}
        </div>

        <slot-cmp ref={(el?: HTMLSlotCmpElement) => el && requestAnimationFrame(() => el.forceUpdate())}>
          <slot-parent-cmp />
        </slot-cmp>
      </Host>
    )
  }
}
