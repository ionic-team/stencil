import { h, proxyCustomElement } from '@stencil/core/internal/client';

const CustomEventCmp = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
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
  get elm() { return this; }
};

const CustomEventRoot = /*@__PURE__*/proxyCustomElement(CustomEventCmp, [0,"custom-event-root",{"output":[32]}]);
const components = ['custom-event-root', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'custom-event-root':
        tagName = 'custom-event-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, CustomEventRoot);
        }
        break;

    }
  });
};

export { CustomEventRoot, defineCustomElement };
