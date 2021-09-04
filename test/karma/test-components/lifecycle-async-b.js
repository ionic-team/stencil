import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleAsyncB$1 } from './cmp-b.js';
import { L as LifecycleAsyncC } from './cmp-c.js';

const LifecycleAsyncB = /*@__PURE__*/proxyCustomElement(LifecycleAsyncB$1, [0,"lifecycle-async-b",{"value":[1]}]);
const components = ['lifecycle-async-b', 'lifecycle-async-c', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-async-b':
        tagName = 'lifecycle-async-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleAsyncB);
        }
        break;

      case 'lifecycle-async-c':
        tagName = 'lifecycle-async-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleAsyncC$1 = /*@__PURE__*/proxyCustomElement(LifecycleAsyncC, [0,"lifecycle-async-b",{"value":[1]}]);
          customElements.define(tagName, LifecycleAsyncC$1);
        }
        break;

    }
  });
};

export { LifecycleAsyncB, defineCustomElement };
