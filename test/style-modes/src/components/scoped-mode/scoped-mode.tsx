import { Component, h } from '@stencil/core';

@Component({
  tag: 'scoped-mode',
  scoped: true,
  styleUrls: {
    buford: 'scoped-mode.buford.css',
    griff: 'scoped-mode.griff.css'
  }
})
export class ScopedMode {

  render() {
    return (
      <section>
        <slot></slot>
      </section>
    );
  }
}
