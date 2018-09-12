import { Component, State } from '../../../../dist/index';

@Component({
  tag: 'dom-interaction',
  shadow: true
})
export class DomInteractionCmp {

  @State() wasClicked = 'false';
  @State() wasFocused = 'false';

  onClick() {
    this.wasClicked = 'true';
  }

  onFocus() {
    this.wasFocused = 'true';
  }

  render() {
    return (
      <div>
        <button onClick={this.onClick.bind(this)} onFocus={this.onFocus.bind(this)}>Button</button>
        <section>
          <label>Clicked:</label> <span class="was-clicked">{this.wasClicked}</span>
        </section>
        <section>
          <label>Focused:</label> <span class="was-focused">{this.wasFocused}</span>
        </section>
      </div>
    );
  }
}
