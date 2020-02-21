import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'slot-cmp-container',
  styles: ':host { display: block; margin: 5em; }',
  shadow: true
})
export class PropCmp {
  @Element() host: HTMLPropCmpElement;

  componentDidLoad() {
    setTimeout(() => this.host.forceUpdate(), 1);
  }

  render() {
    return (
      <Host>
        <slot-cmp>
          <slot-parent-cmp label="One" />
        </slot-cmp>

        <slot-cmp>
          <slot-parent-cmp label="Two" />
        </slot-cmp>

        <slot-cmp>
          <slot-parent-cmp label="Three" />
        </slot-cmp>
      </Host>
    );
  }
}
