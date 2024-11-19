import { h } from '@stencil/core';
import output from './output';
export class Cmpa {
  async componentWillLoad() {
    output('componentWillLoad-a');
  }
  async componentDidLoad() {
    output('componentDidLoad-a');
  }
  render() {
    return h("slot", null);
  }
  static get is() { return "lifecycle-nested-a"; }
  static get encapsulation() { return "shadow"; }
}
