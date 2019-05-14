import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'todo-item'
})
export class TodoItem {

  @Prop() checked: boolean;
  @Prop() text: string;
  @Prop() index: number;
  @Event() itemCheck: EventEmitter;
  @Event() itemRemove: EventEmitter;

  render() {
    return (
      <li class={this.checked ? 'completed' : ''}>
        <input class="toggle" type="checkbox" checked={this.checked} onChange={() => this.itemCheck.emit(this.index)} />
        <label>{this.text}</label>
        <button class="destroy" onClick={() => this.itemRemove.emit(this.index)}></button>
      </li>
    );
  }
}
