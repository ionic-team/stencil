import { r as registerInstance, h } from './index-a2c0d171.js';

const reparentStyleWithVarsCss = ":root{--custom-color:blue}:host{background-color:var(--custom-color, blue);display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

const ReparentStyleWithVars = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return h("div", { class: "css-entry" }, "With CSS Vars");
  }
};
ReparentStyleWithVars.style = reparentStyleWithVarsCss;

export { ReparentStyleWithVars as reparent_style_with_vars };
