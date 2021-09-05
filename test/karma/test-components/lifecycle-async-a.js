import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleAsyncB } from './cmp-b.js';
import { L as LifecycleAsyncC } from './cmp-c.js';

const LifecycleAsyncA$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.value = '';
    this.loads = [];
    this.updates = [];
    this.rendered = 0;
    this.componentWillUpdated = false;
    this.componentDidUpdated = false;
  }
  lifecycleLoad(ev) {
    this.loads = [...this.loads, ev.detail];
  }
  lifecycleUpdate(ev) {
    this.updates = [...this.updates, ev.detail];
  }
  async componentWillLoad() {
    this.loads = [...this.loads, 'componentWillLoad-a'];
  }
  async componentDidLoad() {
    this.loads = [...this.loads, 'componentDidLoad-a'];
  }
  async componentWillUpdate() {
    if (this.value === 'Updated' && !this.componentWillUpdated) {
      this.updates = [...this.updates, 'componentWillUpdate-a'];
      this.componentWillUpdated = true;
    }
  }
  async componentDidUpdate() {
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
      h('div', null, 'LifecycleAsyncA ', this.value),
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
      h('lifecycle-async-b', { value: this.value })
    );
  }
};

const LifecycleAsyncA = /*@__PURE__*/ proxyCustomElement(LifecycleAsyncA$1, [
  0,
  'lifecycle-async-a',
  { value: [32], loads: [32], updates: [32] },
  [
    [0, 'lifecycleLoad', 'lifecycleLoad'],
    [0, 'lifecycleUpdate', 'lifecycleUpdate'],
  ],
]);
const components = ['lifecycle-async-a', 'lifecycle-async-b', 'lifecycle-async-c'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'lifecycle-async-a':
        tagName = 'lifecycle-async-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, LifecycleAsyncA);
        }
        break;

      case 'lifecycle-async-b':
        tagName = 'lifecycle-async-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleAsyncB$1 = /*@__PURE__*/ proxyCustomElement(LifecycleAsyncB, [
            0,
            'lifecycle-async-a',
            { value: [32], loads: [32], updates: [32] },
            [
              [0, 'lifecycleLoad', 'lifecycleLoad'],
              [0, 'lifecycleUpdate', 'lifecycleUpdate'],
            ],
          ]);
          customElements.define(tagName, LifecycleAsyncB$1);
        }
        break;

      case 'lifecycle-async-c':
        tagName = 'lifecycle-async-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleAsyncC$1 = /*@__PURE__*/ proxyCustomElement(LifecycleAsyncC, [
            0,
            'lifecycle-async-a',
            { value: [32], loads: [32], updates: [32] },
            [
              [0, 'lifecycleLoad', 'lifecycleLoad'],
              [0, 'lifecycleUpdate', 'lifecycleUpdate'],
            ],
          ]);
          customElements.define(tagName, LifecycleAsyncC$1);
        }
        break;
    }
  });
};

export { LifecycleAsyncA, defineCustomElement };
