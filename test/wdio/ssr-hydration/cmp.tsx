import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ssr-shadow-cmp',
  shadow: true,
})
export class SsrShadowCmp {
  @Prop() value: string;
  @Prop() label: string;
  @Prop() selected: boolean;
  @Prop() disabled: boolean;

  render() {
    return (
      <div
        class={{
          option: true,
          'option--selected': this.selected,
          'option--disabled': this.disabled,
          'option--novalue': !this.value,
        }}
      >
        <slot />
      </div>
    );
  }
}
