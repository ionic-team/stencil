import { Component, Prop } from 'ionic-core';
import { TodoStore, TodoItem } from '../../services/todo-store';


@Component({
  tag: 'todo-edit',
  templateUrl: 'todo-edit.html'
})
export class TodoEdit {

  @Prop()
  store: TodoStore;

  @Prop()
  todo: TodoItem;

}
