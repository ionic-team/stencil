import { createEvent, h } from '@stencil/core/internal/client';
import { t as timeout } from './cmp-c.js';

const LifecycleAsyncB = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.lifecycleLoad = createEvent(this, 'lifecycleLoad', 7);
    this.lifecycleUpdate = createEvent(this, 'lifecycleUpdate', 7);
    this.value = '';
    this.rendered = 0;
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-b');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-b');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-b');
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-b');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return h(
      'div',
      null,
      h('hr', null),
      h('div', null, 'LifecycleAsyncB ', this.value),
      h('div', { class: 'rendered-b' }, 'rendered b: ', this.rendered),
      h('lifecycle-async-c', { value: this.value })
    );
  }
};

export { LifecycleAsyncB as L };
