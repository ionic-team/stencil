import { proxyCustomElement } from '@stencil/core/internal/client';

const ReflectToAttr$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.str = 'single';
    this.nu = 2;
    this.null = null;
    this.bool = false;
    this.otherBool = true;
    this.disabled = false;
  }
  componentDidLoad() {
    this.dynamicStr = 'value';
    this.el.dynamicNu = 123;
  }
  get el() { return this; }
};

const ReflectToAttr = /*@__PURE__*/proxyCustomElement(ReflectToAttr$1, [0,"reflect-to-attr",{"str":[513],"nu":[514],"undef":[513],"null":[513],"bool":[516],"otherBool":[516,"other-bool"],"disabled":[516],"dynamicStr":[1537,"dynamic-str"],"dynamicNu":[514,"dynamic-nu"]}]);
const components = ['reflect-to-attr', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'reflect-to-attr':
        tagName = 'reflect-to-attr';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ReflectToAttr);
        }
        break;

    }
  });
};

export { ReflectToAttr, defineCustomElement };
