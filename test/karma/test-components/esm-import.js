import { attachShadow, createEvent, h, proxyCustomElement } from '@stencil/core/internal/client';

const esmImportCss =
  ':host{display:block;padding:20px;border:10px solid rgb(0, 0, 255);color:rgb(128, 0, 128);--color:rgb(0, 128, 0)}p{color:var(--color)}';

const EsmImport$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.someEvent = createEvent(this, 'someEvent', 7);
    this.propVal = 0;
    this.isReady = 'false';
    this.listenVal = 0;
    this.someEventInc = 0;
  }
  testClick() {
    this.listenVal++;
  }
  async someMethod() {
    this.someEvent.emit();
  }
  testMethod() {
    this.el.someMethod();
  }
  componentWillLoad() {
    this.stateVal = 'mph';
    this.el.componentOnReady().then(() => {
      this.isReady = 'true';
    });
  }
  componentDidLoad() {
    this.el.parentElement.addEventListener('someEvent', () => {
      this.el.propVal++;
    });
  }
  render() {
    return h(
      'div',
      null,
      h('h1', null, 'esm-import'),
      h('p', { id: 'propVal' }, 'propVal: ', this.propVal),
      h('p', { id: 'stateVal' }, 'stateVal: ', this.stateVal),
      h('p', { id: 'listenVal' }, 'listenVal: ', this.listenVal),
      h('p', null, h('button', { onClick: this.testMethod.bind(this) }, 'Test')),
      h('p', { id: 'isReady' }, 'componentOnReady: ', this.isReady)
    );
  }
  get el() {
    return this;
  }
  static get style() {
    return esmImportCss;
  }
};

const EsmImport = /*@__PURE__*/ proxyCustomElement(EsmImport$1, [
  1,
  'esm-import',
  { propVal: [2, 'prop-val'], isReady: [32], stateVal: [32], listenVal: [32], someEventInc: [32] },
  [[0, 'click', 'testClick']],
]);
const components = ['esm-import'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'esm-import':
        tagName = 'esm-import';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, EsmImport);
        }
        break;
    }
  });
};

export { EsmImport, defineCustomElement };
