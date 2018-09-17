import { Component, Prop } from '../../../../dist';

@Component({
  tag: 'focus-cmp'
})
export class Focus {
  @Prop()
  focusOnOpen = false;
  private focusedButton: HTMLButtonElement;
  componentDidLoad() {
    if (this.focusOnOpen) {
      this.focusedButton.focus();
    }
  }
  render() {
    return (
      <div>
        <button ref={el => (this.focusedButton = el)}>Button</button>
      </div>
    );
  }
}
