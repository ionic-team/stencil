'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ListenWindow = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    return (index.h("div", null, index.h("div", { id: "clicked" }, "Clicked: ", this.clicked), index.h("div", null, "Scrolled: ", this.scrolled), index.h("button", null, "Click!"), index.h("div", { style: { background: 'gray', paddingTop: '2000px' } })));
  }
};

exports.listen_window = ListenWindow;
