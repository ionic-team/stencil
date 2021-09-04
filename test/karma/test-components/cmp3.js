import { h } from '@stencil/core/internal/client';

const AttributeBasic = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.wasClicked = '';
  }
  onClick() {
    this.wasClicked = 'Host event';
  }
  render() {
    return h("span", { id: "result" }, this.wasClicked);
  }
  static get style() { return ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }"; }
};

export { AttributeBasic as A };
