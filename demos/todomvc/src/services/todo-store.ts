
export class TodoStore {
  private todos: TodoItem[];

  constructor() {
    this.todos = this.load();
  }

  getTodos() {
    return this.todos;
  }

  remove(todo: TodoItem) {
    this.todos.splice(this.todos.indexOf(todo), 1);
    this.save();
  }

  add(title: string) {
    let todo: TodoItem = {
      title: title,
      id: this.nextId()
    };

    this.todos.push(todo);
    this.save();
  }

  private load(): TodoItem[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
  }

  private nextId() {
    if (this.todos.length > 0) {
      return Math.max.apply(Math, this.todos.map(t => t.id)) + 1;
    }
    return 0;
  }

}


export interface TodoItem {
  id: number;
  title: string;
  completed?: boolean;
  editing?: boolean;
}


const STORAGE_KEY = 'ionic-core-todos';
