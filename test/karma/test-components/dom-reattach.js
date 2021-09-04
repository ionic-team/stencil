import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const DomReattach$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.willLoad = 0;
    this.didLoad = 0;
    this.didUnload = 0;
  }
  componentWillLoad() {
    this.willLoad++;
  }
  componentDidLoad() {
    this.didLoad++;
  }
  disconnectedCallback() {
    this.didUnload++;
  }
  render() {
    return (h(Host, null, h("p", null, "componentWillLoad: ", this.willLoad), h("p", null, "componentDidLoad: ", this.didLoad), h("p", null, "disconnectedCallback: ", this.didUnload)));
  }
};

const DomReattach = /*@__PURE__*/proxyCustomElement(DomReattach$1, [0,"dom-reattach",{"willLoad":[1026,"will-load"],"didLoad":[1026,"did-load"],"didUnload":[1026,"did-unload"]}]);
const components = ['dom-reattach', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'dom-reattach':
        tagName = 'dom-reattach';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, DomReattach);
        }
        break;

    }
  });
};

export { DomReattach, defineCustomElement };
