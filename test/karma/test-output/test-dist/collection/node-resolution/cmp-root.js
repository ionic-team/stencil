import { h } from '@stencil/core';
import { location as module } from './module';
import { location as moduleIndex } from './module/index';
export class NodeResolution {
  render() {
    return (h("div", null, h("h1", null, "node-resolution"), h("p", { id: "module-index" }, moduleIndex), h("p", { id: "module" }, module)));
  }
  static get is() { return "node-resolution"; }
}
