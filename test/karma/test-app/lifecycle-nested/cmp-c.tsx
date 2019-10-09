import { Host, Component, h } from "@stencil/core";
import output from "./output";

@Component({
  tag: "cmp-c",
  shadow: true
})
export class Cmpc {
  async componentWillLoad() {
    output("componentWillLoad-c");
  }

  componentDidLoad() {
    output("componentDidLoad-c");
  }

  render() {
    return( <Host><div>hello</div></Host>);
  }
}
