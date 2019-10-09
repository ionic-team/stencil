import {Component, h } from "@stencil/core";
import output from "./output";

@Component({
  tag: "cmp-b",
  shadow: true
})
export class Cmpb {
  async componentWillLoad() {
    output("componentWillLoad-b");
  }

  async componentDidLoad() {
    output("componentDidLoad-b");
  }

  render() {
    return <slot />;
  }
}
