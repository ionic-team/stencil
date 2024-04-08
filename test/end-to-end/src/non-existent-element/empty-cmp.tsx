import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'empty-cmp',
  shadow: true,
})
export class EmptyComponent {
  render() {
    return <Host>I have no children!</Host>;
  }
}
