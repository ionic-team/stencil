import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleUnloadA$1 } from './cmp-a.js';
import { L as LifecycleUnloadB } from './cmp-b3.js';

const LifecycleUnloadA = /*@__PURE__*/proxyCustomElement(LifecycleUnloadA$1, [1,"lifecycle-unload-a"]);
const components = ['lifecycle-unload-a', 'lifecycle-unload-b', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-unload-a':
        tagName = 'lifecycle-unload-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleUnloadA);
        }
        break;

      case 'lifecycle-unload-b':
        tagName = 'lifecycle-unload-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleUnloadB$1 = /*@__PURE__*/proxyCustomElement(LifecycleUnloadB, [1,"lifecycle-unload-a"]);
          customElements.define(tagName, LifecycleUnloadB$1);
        }
        break;

    }
  });
};

export { LifecycleUnloadA, defineCustomElement };
