import { Component, Prop } from 'ionic-core';
import { TodoStore } from '../../services/todo-store';


@Component({
  tag: 'todo-footer',
  templateUrl: 'todo-footer.html'
})
export class TodoFooter {

  @Prop()
  store: TodoStore;

  pluralize(word: string, count: number) {
    return word + (count === 1 ? '' : 's');
  }

  get showClearCompleted() {
    return this.store.items.length > this.store.remainingTodos;
  }

}
