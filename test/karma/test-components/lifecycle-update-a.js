import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { L as LifecycleUpdateB } from './cmp-b4.js';
import { L as LifecycleUpdateC } from './cmp-c3.js';

const LifecycleUpdateA$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.values = [];
  }
  testClick() {
    this.values.push(this.values.length + 1);
    this.values = this.values.slice();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:gray">async add child components to lifecycle-update-a</span> ${
      this.values[this.values.length - 1]
    }`;
    document.getElementById('output').appendChild(li);
  }
  componentWillLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:blue">componentWillLoad</span>`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:green">componentDidLoad</span>`;
    document.getElementById('output').appendChild(li);
  }
  componentWillUpdate() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:cyan">componentWillUpdate</span> ${
      this.values[this.values.length - 1]
    }`;
    document.getElementById('output').appendChild(li);
  }
  componentDidUpdate() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:limegreen">componentDidUpdate</span> ${
      this.values[this.values.length - 1]
    }`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return h(
      'div',
      null,
      h('button', { onClick: this.testClick.bind(this), class: 'test' }, 'Add Child Components'),
      h('hr', null),
      this.values.map((value) => {
        return h('lifecycle-update-b', { value: value });
      })
    );
  }
};

const LifecycleUpdateA = /*@__PURE__*/ proxyCustomElement(LifecycleUpdateA$1, [
  0,
  'lifecycle-update-a',
  { values: [32] },
]);
const components = ['lifecycle-update-a', 'lifecycle-update-b', 'lifecycle-update-c'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'lifecycle-update-a':
        tagName = 'lifecycle-update-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, LifecycleUpdateA);
        }
        break;

      case 'lifecycle-update-b':
        tagName = 'lifecycle-update-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleUpdateB$1 = /*@__PURE__*/ proxyCustomElement(LifecycleUpdateB, [
            0,
            'lifecycle-update-a',
            { values: [32] },
          ]);
          customElements.define(tagName, LifecycleUpdateB$1);
        }
        break;

      case 'lifecycle-update-c':
        tagName = 'lifecycle-update-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const LifecycleUpdateC$1 = /*@__PURE__*/ proxyCustomElement(LifecycleUpdateC, [
            0,
            'lifecycle-update-a',
            { values: [32] },
          ]);
          customElements.define(tagName, LifecycleUpdateC$1);
        }
        break;
    }
  });
};

export { LifecycleUpdateA, defineCustomElement };
