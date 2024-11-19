import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ReflectNanAttributeHyphen$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.valNum = undefined;
  }
  render() {
    this.renderCount += 1;
    return h("div", null, "reflect-nan-attribute-hyphen Render Count: ", this.renderCount);
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
}, [1, "reflect-nan-attribute-hyphen", {
    "valNum": [514, "val-num"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["reflect-nan-attribute-hyphen"];
  components.forEach(tagName => { switch (tagName) {
    case "reflect-nan-attribute-hyphen":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ReflectNanAttributeHyphen$1);
      }
      break;
  } });
}

const ReflectNanAttributeHyphen = ReflectNanAttributeHyphen$1;
const defineCustomElement = defineCustomElement$1;

export { ReflectNanAttributeHyphen, defineCustomElement };
