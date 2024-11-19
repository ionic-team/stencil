'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotLightDomRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.a = 'a';
    this.b = 'b';
    this.c = 'c';
    this.d = 'd';
    this.e = 'e';
    this.f = 'f';
    this.g = 'g';
    this.h = 'h';
    this.i = 'i';
    this.j = 'j';
    this.k = 'k';
    this.l = 'l';
    this.m = 'm';
  }
  testClick() {
    this.a = 'A';
    this.b = 'B';
    this.c = 'C';
    this.d = 'D';
    this.e = 'E';
    this.f = 'F';
    this.g = 'G';
    this.h = 'H';
    this.i = 'I';
    this.j = 'J';
    this.k = 'K';
    this.l = 'L';
    this.m = 'M';
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: this.testClick.bind(this) }, "Test"), index.h("slot-light-dom-content", { class: "results1" }, this.a), index.h("slot-light-dom-content", { class: "results2" }, this.b), index.h("slot-light-dom-content", { class: "results3" }, index.h("nav", null, this.c)), index.h("slot-light-dom-content", { class: "results4" }, index.h("nav", null, this.d), this.e), index.h("slot-light-dom-content", { class: "results5" }, this.f, index.h("nav", null, this.g)), index.h("slot-light-dom-content", { class: "results6" }, this.h, index.h("nav", null, this.i), this.j), index.h("slot-light-dom-content", { class: "results7" }, index.h("nav", null, this.k), index.h("nav", null, this.l), index.h("nav", null, this.m))));
  }
};

exports.slot_light_dom_root = SlotLightDomRoot;
