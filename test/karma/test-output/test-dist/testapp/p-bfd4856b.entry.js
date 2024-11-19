import { r as s, h as r, B as i, e } from "./p-55339060.js";

const t = class {
  constructor(r) {
    s(this, r);
  }
  render() {
    return r(e, null, r("p", {
      class: "is-dev"
    }, "isDev: ", `${i.isDev}`), r("p", {
      class: "is-browser"
    }, "isBrowser: ", `${i.isBrowser}`), r("p", {
      class: "is-testing"
    }, "isTesting: ", `${i.isTesting}`));
  }
};

export { t as build_data }