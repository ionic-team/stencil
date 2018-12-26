import { Component, State, Listen, h } from '@stencil/core';


@Component({
  tag: 'my-todo',
  styleUrl: 'my-todo.css'
})
export class MyTodo {
  @State() list: TodoItem[] = [
    { text: 'my initial todo', checked: false },
    { text: 'Learn about Web Components', checked: true }
  ];

  @Listen('onTodoInputSubmit')
  todoInputSubmiHandler(e: CustomEvent) {
    this.list = [...this.list, { text: e.detail, checked: false, }];
  }

  @Listen('onTodoItemChecked')
  todoItemCheckedHandler(e: CustomEvent) {
    const list = [...this.list];
    const item = list[e.detail];
    list[e.detail] = Object.assign({}, item, { checked: !item.checked });
    this.list = list;
  }

  @Listen('onTodoItemRemove')
  todoItemRemoveHandler(e: CustomEvent) {
    this.list = [...this.list.slice(0, e.detail), ...this.list.slice(e.detail + 1)];
  }

  render() {
    return (
      <div>
        <h1>Todos Stencil</h1>
        <section>
          <todo-input></todo-input>
          <ul id="list-container">
            {this.list.map((item, index) => (
              <todo-item
                checked={item.checked}
                text={item.text}
                index={index}
              />
            ))}
          </ul>
        </section>
      </div>
    );
  }
}

interface TodoItem {
  text: string;
  checked: boolean;
}
