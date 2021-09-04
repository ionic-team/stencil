import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleUpdateB$1 } from './cmp-b4.js';
import { L as LifecycleUpdateC } from './cmp-c3.js';

const LifecycleUpdateB = /*@__PURE__*/proxyCustomElement(LifecycleUpdateB$1, [0,"lifecycle-update-b",{"value":[2]}]);
const components = ['lifecycle-update-b', 'lifecycle-update-c', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-update-b':
        tagName = 'lifecycle-update-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleUpdateB);
        }
        break;

      case 'lifecycle-update-c':
        tagName = 'lifecycle-update-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleUpdateC$1 = /*@__PURE__*/proxyCustomElement(LifecycleUpdateC, [0,"lifecycle-update-b",{"value":[2]}]);
          customElements.define(tagName, LifecycleUpdateC$1);
        }
        break;

    }
  });
};

export { LifecycleUpdateB, defineCustomElement };
