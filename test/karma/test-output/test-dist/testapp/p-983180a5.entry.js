import { r, h as s } from "./p-55339060.js";

const o = class {
  constructor(s) {
    r(this, s);
  }
  render() {
    const r = s("div", null, "Do Not Share JSX Nodes!");
    return s("div", null, r, r);
  }
};

export { o as bad_shared_jsx }