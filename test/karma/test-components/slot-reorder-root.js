import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotReorder } from './cmp16.js';

const SlotReorderRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.reordered = false;
  }
  testClick() {
    this.reordered = !this.reordered;
  }
  render() {
    return h(
      'div',
      null,
      h('button', { onClick: this.testClick.bind(this), class: 'test' }, 'Test'),
      h('slot-reorder', { class: 'results1', reordered: this.reordered }),
      h('hr', null),
      h('slot-reorder', { class: 'results2', reordered: this.reordered }, h('div', null, 'default content')),
      h('hr', null),
      h(
        'slot-reorder',
        { class: 'results3', reordered: this.reordered },
        h('div', { slot: 'slot-b' }, 'slot-b content'),
        h('div', null, 'default content'),
        h('div', { slot: 'slot-a' }, 'slot-a content')
      ),
      h('hr', null),
      h(
        'slot-reorder',
        { class: 'results4', reordered: this.reordered },
        h('div', { slot: 'slot-b' }, 'slot-b content'),
        h('div', { slot: 'slot-a' }, 'slot-a content'),
        h('div', null, 'default content')
      )
    );
  }
};

const SlotReorderRoot = /*@__PURE__*/ proxyCustomElement(SlotReorderRoot$1, [
  0,
  'slot-reorder-root',
  { reordered: [32] },
]);
const components = ['slot-reorder-root', 'slot-reorder'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-reorder-root':
        tagName = 'slot-reorder-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotReorderRoot);
        }
        break;

      case 'slot-reorder':
        tagName = 'slot-reorder';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotReorder$1 = /*@__PURE__*/ proxyCustomElement(SlotReorder, [
            0,
            'slot-reorder-root',
            { reordered: [32] },
          ]);
          customElements.define(tagName, SlotReorder$1);
        }
        break;
    }
  });
};

export { SlotReorderRoot, defineCustomElement };
