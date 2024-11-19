import { r as t, h as e, g as i } from "./p-55339060.js";

const n = class {
  constructor(e) {
    t(this, e), this.output = "";
  }
  componentDidLoad() {
    this.elm.addEventListener("eventNoDetail", this.receiveEvent.bind(this)), this.elm.addEventListener("eventWithDetail", this.receiveEvent.bind(this));
  }
  receiveEvent(t) {
    this.output = `${t.type} ${t.detail || ""}`.trim();
  }
  fireCustomEventNoDetail() {
    const t = new CustomEvent("eventNoDetail");
    this.elm.dispatchEvent(t);
  }
  fireCustomEventWithDetail() {
    const t = new CustomEvent("eventWithDetail", {
      detail: 88
    });
    this.elm.dispatchEvent(t);
  }
  render() {
    return e("div", null, e("div", null, e("button", {
      id: "btnNoDetail",
      onClick: this.fireCustomEventNoDetail.bind(this)
    }, "Fire Custom Event, no detail")), e("div", null, e("button", {
      id: "btnWithDetail",
      onClick: this.fireCustomEventWithDetail.bind(this)
    }, "Fire Custom Event, with detail")), e("pre", {
      id: "output"
    }, this.output));
  }
  get elm() {
    return i(this);
  }
};

export { n as custom_event_root }