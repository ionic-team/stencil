'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ListenReattach = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.clicked = 0;
  }
  click() {
    this.clicked++;
  }
  render() {
    return (index.h(index.Host, null, index.h("div", { id: "clicked" }, "Clicked: ", this.clicked)));
  }
};
ListenReattach.style = ".sc-listen-reattach-h { display: block; background: gray;}";

exports.listen_reattach = ListenReattach;
