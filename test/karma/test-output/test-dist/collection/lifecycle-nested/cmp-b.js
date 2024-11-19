import { h } from '@stencil/core';
import output from './output';
export class Cmpb {
  async componentWillLoad() {
    output('componentWillLoad-b');
  }
  async componentDidLoad() {
    output('componentDidLoad-b');
  }
  render() {
    return h("slot", null);
  }
  static get is() { return "lifecycle-nested-b"; }
  static get encapsulation() { return "shadow"; }
}
