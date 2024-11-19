import { h } from '@stencil/core';
import { foo } from './data.json';
export class JsonBasic {
  render() {
    return h("div", { id: "json-foo" }, foo);
  }
  static get is() { return "json-basic"; }
}
