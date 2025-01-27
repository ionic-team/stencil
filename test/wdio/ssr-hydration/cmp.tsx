import { Component, h } from '@stencil/core';

@Component({
  tag: 'ssr-shadow-cmp',
  shadow: true,
})
export class SsrShadowCmp {
  render() {
    return (
      <div>
        <slot />
      </div>
    );
  }
}
