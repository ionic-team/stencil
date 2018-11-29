import { Component, State } from '../../../../dist';

@Component({
  tag: 'shadow-dom-mode-root',
})
export class ShadowDomModeRoot {

  @State() showRed = false;

  componentDidLoad() {
    setTimeout(() => {
      this.showRed = true;
    }, 500);
  }

  render() {
    return (
      <div>
        <shadow-dom-mode id="blue" mode="blue"></shadow-dom-mode>
        {this.showRed ? (
          <shadow-dom-mode id="red"></shadow-dom-mode>
        ) : null}
      </div>
    );
  }

}
