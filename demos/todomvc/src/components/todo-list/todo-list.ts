import { Component, Prop } from 'ionic-core';
import { TodoItem } from '../../services/todo-store';


@Component({
  tag: 'todo-list',
  templateUrl: 'todo-list.html'
})
export class TodoList {

  @Prop({ default: 'default value' })
  todos: TodoItem[];

}
