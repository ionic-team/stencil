import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'repl-viewport',
  styleUrl: 'repl-viewport.css',
  shadow: true
})
export class ReplViewport {

  render() {
    return (
      <Host>
        <section class="left">
          <slot name="left"/>
        </section>
        <section class="right">
          <slot name="right"/>
        </section>
      </Host>
    );
  }
}
