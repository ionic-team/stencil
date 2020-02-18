import { h, Component, State } from "@stencil/core";

@Component({
  tag: "my-counter",
  styleUrl: "my-counter.css",
  shadow: true
})
export class MyCounter {
  @State() count: number = 0;

  inc() {
    this.count++;
  }

  dec() {
    this.count--;
  }

  render() {
    return (
      <div>
        <button class="large btn" onClick={this.dec.bind(this)}>
          -
        </button>
        <span class="large span">{this.count}</span>
        <button class="large btn" onClick={this.inc.bind(this)}>
          +
        </button>
      </div>
    );
  }
}
