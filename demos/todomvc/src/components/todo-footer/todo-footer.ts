import { Component, Prop } from 'ionic-core';
import { TodoStore } from '../../services/todo-store';


@Component({
  tag: 'todo-footer',
  templateUrl: 'todo-footer.html'
})
export class TodoFooter {

  @Prop()
  store: TodoStore;

}
