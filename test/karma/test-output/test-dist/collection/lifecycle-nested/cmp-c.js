import { Host, h } from '@stencil/core';
import output from './output';
export class Cmpc {
  async componentWillLoad() {
    output('componentWillLoad-c');
  }
  componentDidLoad() {
    output('componentDidLoad-c');
  }
  render() {
    return (h(Host, null, h("div", null, "hello")));
  }
  static get is() { return "lifecycle-nested-c"; }
  static get encapsulation() { return "shadow"; }
}
