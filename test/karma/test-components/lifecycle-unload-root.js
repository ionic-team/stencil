import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleUnloadA } from './cmp-a.js';
import { L as LifecycleUnloadB } from './cmp-b3.js';

const LifecycleUnloadRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.renderCmp = true;
  }
  testClick() {
    this.renderCmp = !this.renderCmp;
  }
  render() {
    return h(
      'div',
      null,
      h('button', { onClick: this.testClick.bind(this) }, this.renderCmp ? 'Remove' : 'Add'),
      this.renderCmp ? h('lifecycle-unload-a', null) : null
    );
  }
};

const LifecycleUnloadRoot = /*@__PURE__*/ proxyCustomElement(LifecycleUnloadRoot$1, [
  0,
  'lifecycle-unload-root',
  { renderCmp: [32] },
]);
const components = ['lifecycle-unload-root', 'lifecycle-unload-a', 'lifecycle-unload-b'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'lifecycle-unload-root':
        tagName = 'lifecycle-unload-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, LifecycleUnloadRoot);
        }
        break;

      case 'lifecycle-unload-a':
        tagName = 'lifecycle-unload-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleUnloadA$1 = /*@__PURE__*/ proxyCustomElement(LifecycleUnloadA, [
            0,
            'lifecycle-unload-root',
            { renderCmp: [32] },
          ]);
          customElements.define(tagName, LifecycleUnloadA$1);
        }
        break;

      case 'lifecycle-unload-b':
        tagName = 'lifecycle-unload-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleUnloadB$1 = /*@__PURE__*/ proxyCustomElement(LifecycleUnloadB, [
            0,
            'lifecycle-unload-root',
            { renderCmp: [32] },
          ]);
          customElements.define(tagName, LifecycleUnloadB$1);
        }
        break;
    }
  });
};

export { LifecycleUnloadRoot, defineCustomElement };
