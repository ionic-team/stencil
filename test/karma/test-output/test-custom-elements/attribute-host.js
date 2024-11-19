import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const AttributeHost$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.attrsAdded = false;
  }
  testClick() {
    this.attrsAdded = !this.attrsAdded;
  }
  render() {
    const propsToRender = {};
    if (this.attrsAdded) {
      propsToRender.color = 'lime';
      propsToRender.content = 'attributes added';
      propsToRender.padding = true;
      propsToRender.margin = '';
      propsToRender.bold = 'true';
      propsToRender['no-attr'] = null;
    }
    else {
      propsToRender.content = 'attributes removed';
      propsToRender.padding = false;
      propsToRender.bold = 'false';
      propsToRender['no-attr'] = null;
    }
    return [
      h("button", { onClick: this.testClick.bind(this) }, this.attrsAdded ? 'Remove' : 'Add', " Attributes"),
      h("section", Object.assign({}, propsToRender, { style: {
          'border-color': this.attrsAdded ? 'black' : '',
          display: this.attrsAdded ? 'block' : 'inline-block',
          fontSize: this.attrsAdded ? '24px' : '',
          '--css-var': this.attrsAdded ? '12' : '',
        } })),
    ];
  }
  static get style() { return "[color=lime] {\n      background: lime;\n    }\n    section::before {\n      content: attr(content);\n    }\n    [padding=true] {\n      padding: 50px;\n    }\n    [margin] {\n      margin: 50px;\n    }\n    [bold=true] {\n      font-weight: bold;\n    }"; }
}, [0, "attribute-host", {
    "attrsAdded": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["attribute-host"];
  components.forEach(tagName => { switch (tagName) {
    case "attribute-host":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeHost$1);
      }
      break;
  } });
}

const AttributeHost = AttributeHost$1;
const defineCustomElement = defineCustomElement$1;

export { AttributeHost, defineCustomElement };
