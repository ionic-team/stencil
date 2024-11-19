import { r as registerInstance, h } from './index-a2c0d171.js';

const reparentStyleNoVarsCss = ":host{background-color:teal;display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

const ReparentStyleNoVars = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return h("div", { class: "css-entry" }, "No CSS Variables");
  }
};
ReparentStyleNoVars.style = reparentStyleNoVarsCss;

export { ReparentStyleNoVars as reparent_style_no_vars };
