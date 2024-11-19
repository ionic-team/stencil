import { r as registerInstance, h } from './index-a2c0d171.js';

const AttributeBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.wasClicked = '';
  }
  onClick() {
    this.wasClicked = 'Host event';
  }
  render() {
    return h("span", { id: "result" }, this.wasClicked);
  }
};
AttributeBasic.style = ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }";

export { AttributeBasic as listen_jsx };
