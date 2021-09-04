import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleBasicC$1 } from './cmp-c2.js';

const LifecycleBasicC = /*@__PURE__*/proxyCustomElement(LifecycleBasicC$1, [0,"lifecycle-basic-c",{"value":[1],"rendered":[32]}]);
const components = ['lifecycle-basic-c', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-basic-c':
        tagName = 'lifecycle-basic-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleBasicC);
        }
        break;

    }
  });
};

export { LifecycleBasicC, defineCustomElement };
