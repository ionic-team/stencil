import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const StaticStyles = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("h1", null, "static get styles()")));
  }
};
StaticStyles.style = "h1 {\n        color: red;\n      }";

export { StaticStyles as static_styles };
