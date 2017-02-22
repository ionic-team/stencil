import { Component } from 'ionic-core';
import { TodoStore } from '../services/todo-store';


@Component({
  tag: 'todo-app',
  templateUrl: 'app.html'
})
export class App {
  store: TodoStore;

  constructor() {
    this.store = new TodoStore();
  }

}
