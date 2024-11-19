import { r as t, f as s, h as e, g as i } from "./p-55339060.js";

const o = class {
  constructor(e) {
    t(this, e), this.someEvent = s(this, "someEvent", 7), this.propVal = 0, this.isReady = "false", 
    this.stateVal = void 0, this.listenVal = 0, this.someEventInc = 0;
  }
  testClick() {
    this.listenVal++;
  }
  async someMethod() {
    this.someEvent.emit();
  }
  testMethod() {
    this.el.someMethod();
  }
  componentWillLoad() {
    this.stateVal = "mph", this.el.componentOnReady().then((() => {
      this.isReady = "true";
    }));
  }
  componentDidLoad() {
    this.el.parentElement.addEventListener("someEvent", (() => {
      this.el.propVal++;
    }));
  }
  render() {
    return e("div", null, e("h1", null, "esm-import"), e("p", {
      id: "propVal"
    }, "propVal: ", this.propVal), e("p", {
      id: "stateVal"
    }, "stateVal: ", this.stateVal), e("p", {
      id: "listenVal"
    }, "listenVal: ", this.listenVal), e("p", null, e("button", {
      onClick: this.testMethod.bind(this)
    }, "Test")), e("p", {
      id: "isReady"
    }, "componentOnReady: ", this.isReady));
  }
  get el() {
    return i(this);
  }
};

o.style = ":host{display:block;padding:20px;border:10px solid rgb(0, 0, 255);color:rgb(128, 0, 128);--color:rgb(0, 128, 0)}p{color:var(--color)}";

export { o as esm_import }