'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const CustomEventCmp = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    return (index.h("div", null, index.h("div", null, index.h("button", { id: "btnNoDetail", onClick: this.fireCustomEventNoDetail.bind(this) }, "Fire Custom Event, no detail")), index.h("div", null, index.h("button", { id: "btnWithDetail", onClick: this.fireCustomEventWithDetail.bind(this) }, "Fire Custom Event, with detail")), index.h("pre", { id: "output" }, this.output)));
  }
  get elm() { return index.getElement(this); }
};

exports.custom_event_root = CustomEventCmp;
