import { r as registerInstance, h, B as Build, e as Host } from './index-a2c0d171.js';

const BuildData = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("p", { class: "is-dev" }, "isDev: ", `${Build.isDev}`), h("p", { class: "is-browser" }, "isBrowser: ", `${Build.isBrowser}`), h("p", { class: "is-testing" }, "isTesting: ", `${Build.isTesting}`)));
  }
};

export { BuildData as build_data };
