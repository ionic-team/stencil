import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleBasicB$1 } from './cmp-b2.js';
import { L as LifecycleBasicC } from './cmp-c2.js';

const LifecycleBasicB = /*@__PURE__*/proxyCustomElement(LifecycleBasicB$1, [0,"lifecycle-basic-b",{"value":[1],"rendered":[32]}]);
const components = ['lifecycle-basic-b', 'lifecycle-basic-c', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-basic-b':
        tagName = 'lifecycle-basic-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleBasicB);
        }
        break;

      case 'lifecycle-basic-c':
        tagName = 'lifecycle-basic-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleBasicC$1 = /*@__PURE__*/proxyCustomElement(LifecycleBasicC, [0,"lifecycle-basic-b",{"value":[1],"rendered":[32]}]);
          customElements.define(tagName, LifecycleBasicC$1);
        }
        break;

    }
  });
};

export { LifecycleBasicB, defineCustomElement };
