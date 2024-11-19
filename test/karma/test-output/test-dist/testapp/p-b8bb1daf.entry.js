import { r as t, h as e, g as s, e as a } from "./p-55339060.js";

const r = class {
  constructor(e) {
    t(this, e), this.state = !1;
  }
  async toggleState() {
    this.state = !this.state;
  }
  hostData() {
    return {
      readonly: this.state,
      tappable: this.state,
      str: this.state ? "hello" : null,
      "aria-hidden": `${this.state}`,
      fixedtrue: "true",
      fixedfalse: "false",
      "no-appear": void 0,
      "no-appear2": !1
    };
  }
  __stencil_render() {
    return [ e("button", {
      onClick: this.toggleState.bind(this)
    }, "Toggle attributes"), e("attribute-boolean", {
      boolState: this.state,
      strState: this.state,
      noreflect: this.state,
      tappable: this.state,
      "aria-hidden": `${this.state}`
    }) ];
  }
  get el() {
    return s(this);
  }
  render() {
    return e(a, this.hostData(), this.__stencil_render());
  }
};

export { r as attribute_boolean_root }