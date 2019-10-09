import { Component, h } from "@stencil/core";
import output from "./output";

@Component({
  tag: "cmp-a",
  shadow: true
})
export class Cmpa {
  async componentWillLoad() {
    output("componentWillLoad-a");
  }

  async componentDidLoad() {
    output("componentDidLoad-a");
  }

  render() {
    return <slot />;
  }
}
