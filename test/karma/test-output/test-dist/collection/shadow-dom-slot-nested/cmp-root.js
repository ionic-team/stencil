import { h } from '@stencil/core';
export class ShadowDomSlotNestedRoot {
  render() {
    const nested = [0, 1, 2].map((i) => {
      return h("shadow-dom-slot-nested", { i: i }, "light dom: ", i);
    });
    return [h("section", null, "shadow-dom-slot-nested"), h("article", null, nested)];
  }
  static get is() { return "shadow-dom-slot-nested-root"; }
  static get encapsulation() { return "shadow"; }
  static get styles() { return ":host {\n      color: green;\n      font-weight: bold;\n    }"; }
}
