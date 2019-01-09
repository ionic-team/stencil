import { Component, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'todo-input'
})
export class TodoInput {
  @Event() onTodoInputSubmit: EventEmitter;
  @State() value: string;

  handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (!this.value) return;
    this.onTodoInputSubmit.emit(this.value);
    this.value = '';
  }

  handleInputChange = (event: any) => this.value = event.target.value;

  render() {
    return (
      <form onSubmit={this.handleOnSubmit}>
        <input
          class="new-todo"
          value={this.value}
          type="text"
          placeholder="What needs to be done?"
          onInput={this.handleInputChange}
        />
      </form>
    );
  }
}
