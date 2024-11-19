import { h, Build, Host } from '@stencil/core';
export class BuildData {
  render() {
    return (h(Host, null, h("p", { class: "is-dev" }, "isDev: ", `${Build.isDev}`), h("p", { class: "is-browser" }, "isBrowser: ", `${Build.isBrowser}`), h("p", { class: "is-testing" }, "isTesting: ", `${Build.isTesting}`)));
  }
  static get is() { return "build-data"; }
}
