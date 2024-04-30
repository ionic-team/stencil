import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'my-cmp',
})
export class MyCmp {
  render() {
    return <Host>Hello World!</Host>;
  }
}
