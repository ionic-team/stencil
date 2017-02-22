import { Component, Prop } from 'ionic-core';
import { TodoStore } from '../../services/todo-store';


@Component({
  tag: 'todo-list',
  templateUrl: 'todo-list.html'
})
export class TodoList {

  @Prop()
  store: TodoStore;

  get allDone() {
    return this.store.remainingTodos === 0;
  }

  set allDone(value: boolean) {
    this.store.setAllChecked(value);
  }

}
