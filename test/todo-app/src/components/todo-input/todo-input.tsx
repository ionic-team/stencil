import { Component, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'todo-input'
})
export class TodoInput {
  @Event() inputSubmit: EventEmitter;
  @State() value: string;

  handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (!this.value) return;
    this.inputSubmit.emit(this.value);
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
