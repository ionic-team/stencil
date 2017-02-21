import { Component } from 'ionic-core';
import { TodoItem, TodoStore } from '../services/todo-store';


@Component({
  tag: 'todo-app',
  templateUrl: 'app.html'
})
export class App {
  todos: TodoItem[];
  store: TodoStore;
  editedTodo: TodoItem = null;

  constructor() {
    this.store = new TodoStore();
    this.todos = this.store.getTodos();
  }

}
