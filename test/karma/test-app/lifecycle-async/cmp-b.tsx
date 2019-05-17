import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { timeout } from './util';

@Component({
  tag: 'lifecycle-async-b'
})
export class LifecycleAsyncB {

  @Prop() value = '';
  @State() rendered = 0;

  @Event() lifecycleLoad!: EventEmitter;
  @Event() lifecycleUpdate!: EventEmitter;

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

    return (
      <div>
        <hr/>
        <div>
          LifecycleAsyncB {this.value}
        </div>
        <div class='rendered-b'>
          rendered b: {this.rendered}
        </div>
        <lifecycle-async-c value={this.value} />
      </div>
    );
  }
}
