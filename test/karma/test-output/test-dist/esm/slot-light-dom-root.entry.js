import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotLightDomRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test"), h("slot-light-dom-content", { class: "results1" }, this.a), h("slot-light-dom-content", { class: "results2" }, this.b), h("slot-light-dom-content", { class: "results3" }, h("nav", null, this.c)), h("slot-light-dom-content", { class: "results4" }, h("nav", null, this.d), this.e), h("slot-light-dom-content", { class: "results5" }, this.f, h("nav", null, this.g)), h("slot-light-dom-content", { class: "results6" }, this.h, h("nav", null, this.i), this.j), h("slot-light-dom-content", { class: "results7" }, h("nav", null, this.k), h("nav", null, this.l), h("nav", null, this.m))));
  }
};

export { SlotLightDomRoot as slot_light_dom_root };
