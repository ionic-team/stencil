import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'shadow-dom-mode-root',
})
export class ShadowDomModeRoot {
  @State() showRed = false;

  componentDidLoad() {
    setTimeout(() => {
      this.showRed = true;
    }, 50);
  }

  render() {
    return (
      <div>
        <shadow-dom-mode id="blue" colormode="blue"></shadow-dom-mode>
        {this.showRed ? <shadow-dom-mode id="red"></shadow-dom-mode> : null}
      </div>
    );
  }
}
