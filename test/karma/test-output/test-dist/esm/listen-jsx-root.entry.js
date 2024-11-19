import { r as registerInstance, h } from './index-a2c0d171.js';

const AttributeBasicRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onClick = () => {
      this.wasClicked = 'Parent event';
    };
    this.wasClicked = '';
  }
  render() {
    return [h("span", { id: "result-root" }, this.wasClicked), h("listen-jsx", { onClick: this.onClick })];
  }
};

export { AttributeBasicRoot as listen_jsx_root };
