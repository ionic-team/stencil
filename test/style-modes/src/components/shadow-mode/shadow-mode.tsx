import { Component, h } from '@stencil/core';

@Component({
  tag: 'shadow-mode',
  shadow: true,
  styleUrls: {
    buford: 'shadow-mode.buford.css',
    griff: 'shadow-mode.griff.css'
  }
})
export class ShadowMode {

  render() {
    return (
      <section>
        <slot></slot>
      </section>
    );
  }
}
