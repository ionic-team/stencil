import { Component, Host, h, Prop } from '@stencil/core';


@Component({
  tag: 'repl-header',
  styleUrl: 'repl-header.css',
  shadow: true
})
export class ReplHeader {

  @Prop() appName: string;

  render() {
    return (
      <Host>
        {this.appName}
      </Host>
    );
  }
}
