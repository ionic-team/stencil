import { createEvent, h } from '@stencil/core/internal/client';

function timeout(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

const LifecycleAsyncC = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.lifecycleLoad = createEvent(this, 'lifecycleLoad', 7);
    this.lifecycleUpdate = createEvent(this, 'lifecycleUpdate', 7);
    this.value = '';
    this.rendered = 0;
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-c');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-c');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-c');
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return h(
      'div',
      null,
      h('hr', null),
      h('div', null, 'LifecycleAsyncC ', this.value),
      h('div', { class: 'rendered-c' }, 'rendered c: ', this.rendered)
    );
  }
};

export { LifecycleAsyncC as L, timeout as t };
