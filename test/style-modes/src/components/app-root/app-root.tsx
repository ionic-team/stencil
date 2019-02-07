import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root'
})
export class AppRoot {

  render() {
    return (
      <div>
        <h3>Shadow</h3>
        <shadow-mode>Shadow Mode, Default</shadow-mode>
        <shadow-mode mode="buford">Shadow Mode, attribute="buford"</shadow-mode>
        <shadow-mode mode="griff">Shadow Mode, attribute="griff"</shadow-mode>

        <h3>Scoped</h3>
        <scoped-mode>Scoped Mode, Default</scoped-mode>
        <scoped-mode mode="buford">Scoped Mode, attribute="buford"</scoped-mode>
        <scoped-mode mode="griff">Scoped Mode, attribute="griff"</scoped-mode>
      </div>
    );
  }
}
