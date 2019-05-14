import { Component, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'todo-input'
})
export class TodoInput {

  @Event() inputSubmit: EventEmitter;
  @State() value: string;

  render() {
    return (
      <form onSubmit={(e: any) => {
        e.preventDefault();
        if (!this.value) return;
        this.inputSubmit.emit(this.value);
        this.value = '';
      }}>
        <input
          class="new-todo"
          value={this.value}
          type="text"
          placeholder="What needs to be done?"
          onInput={(ev: any) => this.value = ev.target.value}
        />
      </form>
    );
  }
}
