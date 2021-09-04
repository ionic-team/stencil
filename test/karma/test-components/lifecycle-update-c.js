import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleUpdateC$1 } from './cmp-c3.js';

const LifecycleUpdateC = /*@__PURE__*/proxyCustomElement(LifecycleUpdateC$1, [0,"lifecycle-update-c",{"value":[2]}]);
const components = ['lifecycle-update-c', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-update-c':
        tagName = 'lifecycle-update-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleUpdateC);
        }
        break;

    }
  });
};

export { LifecycleUpdateC, defineCustomElement };
