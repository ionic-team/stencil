import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root'
})
export class AppRoot {

  render() {
    return (
      <div>
        <shadow-mode>Shadow Mode, Default</shadow-mode>
        <shadow-mode mode="buford">Shadow Mode, attribute="buford"</shadow-mode>
        <shadow-mode mode="griff">Shadow Mode, attribute="griff"</shadow-mode>
      </div>
    );
  }
}
