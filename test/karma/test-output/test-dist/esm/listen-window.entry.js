import { r as registerInstance, h } from './index-a2c0d171.js';

const ListenWindow = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.clicked = 0;
    this.scrolled = 0;
  }
  winClick() {
    this.clicked++;
  }
  winScroll() {
    this.scrolled++;
  }
  render() {
    return (h("div", null, h("div", { id: "clicked" }, "Clicked: ", this.clicked), h("div", null, "Scrolled: ", this.scrolled), h("button", null, "Click!"), h("div", { style: { background: 'gray', paddingTop: '2000px' } })));
  }
};

export { ListenWindow as listen_window };
