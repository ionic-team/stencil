import { Component, Listen, State, h, Host } from '@stencil/core';

@Component({
  tag: 'listen-reattach',
  styles: ':host { display: block; background: gray;}',
  scoped: true,
})
export class ListenReattach {
  @State() clicked = 0;

  @Listen('click')
  click() {
    this.clicked++;
  }

  render() {
    return (
      <Host>
        <div id="clicked">Clicked: {this.clicked}</div>
      </Host>
    );
  }
}
