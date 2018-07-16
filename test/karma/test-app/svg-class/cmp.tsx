import { Component, State } from '../../../../dist';

@Component({
  tag: 'svg-class'
})
export class SvgClass {

  @State() hasColor = false;

  testClick() {
    this.hasColor = !this.hasColor;
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.testClick.bind(this)}>Test</button>
        </div>
        <div>
          <svg viewBox="0 0 54 54" class={this.hasColor ? 'primary' : null}>
            <circle cx="8" cy="18" width="54" height="8" r="2" class={this.hasColor ? 'red' : null}/>
            <rect y="2" width="54" height="8" rx="2" class={this.hasColor ? 'blue' : null}/>
          </svg>
        </div>
      </div>
    );
  }

}
