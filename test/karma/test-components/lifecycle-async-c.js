import { proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleAsyncC$1 } from './cmp-c.js';

const LifecycleAsyncC = /*@__PURE__*/ proxyCustomElement(LifecycleAsyncC$1, [0, 'lifecycle-async-c', { value: [1] }]);
const components = ['lifecycle-async-c'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'lifecycle-async-c':
        tagName = 'lifecycle-async-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, LifecycleAsyncC);
        }
        break;
    }
  });
};

export { LifecycleAsyncC, defineCustomElement };
