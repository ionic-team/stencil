import { Component, Prop } from 'ionic-core';
import { TodoItem } from '../../services/todo-store';


@Component({
  tag: 'todo-list',
  templateUrl: 'todo-list.html'
})
export class TodoList {
  allDone = false;

  @Prop()
  todos: TodoItem[];

  @Prop()
  editedTodo: TodoItem;

  get filteredTodos(): any[] {
    return this.todos;
  }

}
