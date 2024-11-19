import { r as registerInstance, h } from './index-a2c0d171.js';

const cmpRootMdCss = ".sc-scoped-basic-root-md-h{color:white}";

const ScopedBasicRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("scoped-basic", null, h("span", null, "light")));
  }
};
ScopedBasicRoot.style = {
  md: cmpRootMdCss
};

export { ScopedBasicRoot as scoped_basic_root };
