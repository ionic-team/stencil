import { h, proxyCustomElement } from '@stencil/core/internal/client';

const CmpTag3d = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("div", null, "tag-3d-component");
  }
};

const Tag3dComponent = /*@__PURE__*/proxyCustomElement(CmpTag3d, [0,"tag-3d-component"]);
const components = ['tag-3d-component', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'tag-3d-component':
        tagName = 'tag-3d-component';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, Tag3dComponent);
        }
        break;

    }
  });
};

export { Tag3dComponent, defineCustomElement };
