import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ListenWindow$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.clicked = 0;
    this.scrolled = 0;
  }
  winClick() {
    this.clicked++;
  }
  winScroll() {
    this.scrolled++;
  }
  render() {
    return (h("div", null, h("div", { id: "clicked" }, "Clicked: ", this.clicked), h("div", null, "Scrolled: ", this.scrolled), h("button", null, "Click!"), h("div", { style: { background: 'gray', paddingTop: '2000px' } })));
  }
}, [0, "listen-window", {
    "clicked": [32],
    "scrolled": [32]
  }, [[8, "click", "winClick"], [9, "scroll", "winScroll"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["listen-window"];
  components.forEach(tagName => { switch (tagName) {
    case "listen-window":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ListenWindow$1);
      }
      break;
  } });
}

const ListenWindow = ListenWindow$1;
const defineCustomElement = defineCustomElement$1;

export { ListenWindow, defineCustomElement };
