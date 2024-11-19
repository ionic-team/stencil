import { r as registerInstance, h } from './index-a2c0d171.js';

const AttributeHost = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
};
AttributeHost.style = "[color=lime] {\n      background: lime;\n    }\n    section::before {\n      content: attr(content);\n    }\n    [padding=true] {\n      padding: 50px;\n    }\n    [margin] {\n      margin: 50px;\n    }\n    [bold=true] {\n      font-weight: bold;\n    }";

export { AttributeHost as attribute_host };
