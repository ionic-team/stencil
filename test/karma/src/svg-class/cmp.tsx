import { Component, State } from '../../../../dist/index';

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
          <svg class={this.hasColor ? 'red' : null}>
            <circle class={this.hasColor ? 'green' : null}/>
            <line class={this.hasColor ? 'blue' : null}/>
          </svg>
        </div>
      </div>
    );
  }

}
