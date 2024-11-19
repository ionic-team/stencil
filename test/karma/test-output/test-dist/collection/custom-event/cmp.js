import { h } from '@stencil/core';
export class CustomEventCmp {
  constructor() {
    this.output = '';
  }
  componentDidLoad() {
    this.elm.addEventListener('eventNoDetail', this.receiveEvent.bind(this));
    this.elm.addEventListener('eventWithDetail', this.receiveEvent.bind(this));
  }
  receiveEvent(ev) {
    this.output = `${ev.type} ${ev.detail || ''}`.trim();
  }
  fireCustomEventNoDetail() {
    const ev = new CustomEvent('eventNoDetail');
    this.elm.dispatchEvent(ev);
  }
  fireCustomEventWithDetail() {
    const ev = new CustomEvent('eventWithDetail', { detail: 88 });
    this.elm.dispatchEvent(ev);
  }
  render() {
    return (h("div", null, h("div", null, h("button", { id: "btnNoDetail", onClick: this.fireCustomEventNoDetail.bind(this) }, "Fire Custom Event, no detail")), h("div", null, h("button", { id: "btnWithDetail", onClick: this.fireCustomEventWithDetail.bind(this) }, "Fire Custom Event, with detail")), h("pre", { id: "output" }, this.output)));
  }
  static get is() { return "custom-event-root"; }
  static get states() {
    return {
      "output": {}
    };
  }
  static get elementRef() { return "elm"; }
}
