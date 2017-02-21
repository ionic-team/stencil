import { Component, Prop } from 'ionic-core';
import { TodoItem } from '../../services/todo-store';


@Component({
  tag: 'todo-footer',
  templateUrl: 'todo-footer.html'
})
export class TodoFooter {

  @Prop()
  todos: TodoItem[];

}
