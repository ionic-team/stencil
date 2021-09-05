import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleBasicB } from './cmp-b2.js';
import { L as LifecycleBasicC } from './cmp-c2.js';

const LifecycleBasicA$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.value = '';
    this.rendered = 0;
    this.loads = [];
    this.updates = [];
    this.componentWillUpdated = false;
    this.componentDidUpdated = false;
  }
  lifecycleLoad(ev) {
    this.loads = [...this.loads, ev.detail];
  }
  lifecycleUpdate(ev) {
    this.updates = [...this.updates, ev.detail];
  }
  componentWillLoad() {
    this.loads = [...this.loads, 'componentWillLoad-a'];
  }
  componentDidLoad() {
    this.loads = [...this.loads, 'componentDidLoad-a'];
  }
  componentWillUpdate() {
    if (this.value === 'Updated' && !this.componentWillUpdated) {
      this.updates = [...this.updates, 'componentWillUpdate-a'];
      this.componentWillUpdated = true;
    }
  }
  componentDidUpdate() {
    if (this.value === 'Updated' && !this.componentDidUpdated) {
      this.updates = [...this.updates, 'componentDidUpdate-a'];
      this.componentDidUpdated = true;
    }
  }
  testClick() {
    this.value = 'Updated';
  }
  render() {
    this.rendered++;
    return h(
      'div',
      null,
      h('button', { onClick: this.testClick.bind(this), class: 'test' }, 'Update'),
      h('hr', null),
      h('div', null, 'LifecycleBasicA ', this.value),
      h('div', { class: 'rendered-a' }, 'rendered a: ', this.rendered),
      h('div', null, 'loads a:'),
      h(
        'ol',
        { class: 'lifecycle-loads-a' },
        this.loads.map((load) => {
          return h('li', null, load);
        })
      ),
      h('div', null, 'updates a:'),
      h(
        'ol',
        { class: 'lifecycle-updates-a' },
        this.updates.map((update) => {
          return h('li', null, update);
        })
      ),
      h('lifecycle-basic-b', { value: this.value })
    );
  }
};

const LifecycleBasicA = /*@__PURE__*/ proxyCustomElement(LifecycleBasicA$1, [
  0,
  'lifecycle-basic-a',
  { value: [32], rendered: [32], loads: [32], updates: [32] },
  [
    [0, 'lifecycleLoad', 'lifecycleLoad'],
    [0, 'lifecycleUpdate', 'lifecycleUpdate'],
  ],
]);
const components = ['lifecycle-basic-a', 'lifecycle-basic-b', 'lifecycle-basic-c'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'lifecycle-basic-a':
        tagName = 'lifecycle-basic-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, LifecycleBasicA);
        }
        break;

      case 'lifecycle-basic-b':
        tagName = 'lifecycle-basic-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleBasicB$1 = /*@__PURE__*/ proxyCustomElement(LifecycleBasicB, [
            0,
            'lifecycle-basic-a',
            { value: [32], rendered: [32], loads: [32], updates: [32] },
            [
              [0, 'lifecycleLoad', 'lifecycleLoad'],
              [0, 'lifecycleUpdate', 'lifecycleUpdate'],
            ],
          ]);
          customElements.define(tagName, LifecycleBasicB$1);
        }
        break;

      case 'lifecycle-basic-c':
        tagName = 'lifecycle-basic-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleBasicC$1 = /*@__PURE__*/ proxyCustomElement(LifecycleBasicC, [
            0,
            'lifecycle-basic-a',
            { value: [32], rendered: [32], loads: [32], updates: [32] },
            [
              [0, 'lifecycleLoad', 'lifecycleLoad'],
              [0, 'lifecycleUpdate', 'lifecycleUpdate'],
            ],
          ]);
          customElements.define(tagName, LifecycleBasicC$1);
        }
        break;
    }
  });
};

export { LifecycleBasicA, defineCustomElement };
