import { Component, Prop } from 'ionic-core';
import { TodoStore, TodoItem } from '../../services/todo-store';


@Component({
  tag: 'todo-list',
  templateUrl: 'todo-list.html'
})
export class TodoList {

  @Prop()
  store: TodoStore;

  get filteredTodos() {
    return this.store.items;
  }

  get allDone() {
    return this.store.remainingTodos === 0;
  }

  set allDone(value: boolean) {
    debugger
    this.store.setAllChecked(value);
  }

}
