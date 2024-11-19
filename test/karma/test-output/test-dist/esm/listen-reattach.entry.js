import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const ListenReattach = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.clicked = 0;
  }
  click() {
    this.clicked++;
  }
  render() {
    return (h(Host, null, h("div", { id: "clicked" }, "Clicked: ", this.clicked)));
  }
};
ListenReattach.style = ".sc-listen-reattach-h { display: block; background: gray;}";

export { ListenReattach as listen_reattach };
