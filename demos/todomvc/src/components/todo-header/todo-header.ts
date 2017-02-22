import { Component, Prop } from 'ionic-core';
import { TodoStore } from '../../services/todo-store';


@Component({
  tag: 'todo-header',
  templateUrl: 'todo-header.html'
})
export class TodoHeader {

  @Prop()
  store: TodoStore;

  newTodo = '';

  addTodo() {
    this.store.add(this.newTodo);
    this.newTodo = '';
  }

}
