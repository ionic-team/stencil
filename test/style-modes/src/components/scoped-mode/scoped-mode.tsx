import { Component, h } from '@stencil/core';

/**
 * @virtualProp { 'buford' | 'griff'} mode - This is the mode
 */
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
