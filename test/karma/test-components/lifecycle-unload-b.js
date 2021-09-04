import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleUnloadB$1 } from './cmp-b3.js';

const LifecycleUnloadB = /*@__PURE__*/proxyCustomElement(LifecycleUnloadB$1, [1,"lifecycle-unload-b"]);
const components = ['lifecycle-unload-b', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-unload-b':
        tagName = 'lifecycle-unload-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleUnloadB);
        }
        break;

    }
  });
};

export { LifecycleUnloadB, defineCustomElement };
