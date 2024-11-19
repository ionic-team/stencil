import { r as t, h as s } from "./p-55339060.js";

const i = class {
  constructor(s) {
    t(this, s), this.a = "a", this.b = "b", this.c = "c", this.d = "d", this.e = "e", 
    this.f = "f", this.g = "g", this.h = "h", this.i = "i", this.j = "j", this.k = "k", 
    this.l = "l", this.m = "m";
  }
  testClick() {
    this.a = "A", this.b = "B", this.c = "C", this.d = "D", this.e = "E", this.f = "F", 
    this.g = "G", this.h = "H", this.i = "I", this.j = "J", this.k = "K", this.l = "L", 
    this.m = "M";
  }
  render() {
    return s("div", null, s("button", {
      onClick: this.testClick.bind(this)
    }, "Test"), s("slot-light-dom-content", {
      class: "results1"
    }, this.a), s("slot-light-dom-content", {
      class: "results2"
    }, this.b), s("slot-light-dom-content", {
      class: "results3"
    }, s("nav", null, this.c)), s("slot-light-dom-content", {
      class: "results4"
    }, s("nav", null, this.d), this.e), s("slot-light-dom-content", {
      class: "results5"
    }, this.f, s("nav", null, this.g)), s("slot-light-dom-content", {
      class: "results6"
    }, this.h, s("nav", null, this.i), this.j), s("slot-light-dom-content", {
      class: "results7"
    }, s("nav", null, this.k), s("nav", null, this.l), s("nav", null, this.m)));
  }
};

export { i as slot_light_dom_root }