
export class TodoStore {
  items: TodoItem[];
  editedTodo: TodoItem = null;
  beforeEditCache: string;

  constructor() {
    this.items = this.load();
  }

  add(title: string) {
    let value = title && title.trim();
    if (!value) {
      return;
    }

    let todo: TodoItem = {
      title: title,
      id: this.nextId(),
      completed: false,
      editing: false
    };

    this.items.push(todo);
    this.save();
  }

  remove(todo: TodoItem) {
    let index = this.items.indexOf(todo);
    if (index > -1) {
      this.items.splice(index, 1);
      this.save();
    }
  }

  editTodo(todo: TodoItem) {
    this.beforeEditCache = todo.title;
    this.editedTodo = todo;
  }

  doneEdit(todo: TodoItem) {
    if (!this.editedTodo) {
      return;
    }
    this.editedTodo = null;
    todo.title = todo.title.trim();
    if (!todo.title) {
      this.remove(todo);
    }
  }

  cancelEdit(todo: TodoItem) {
    this.editedTodo = null;
    todo.title = this.beforeEditCache;
  }

  setAllChecked(checked: boolean) {
    debugger
    this.items.forEach(todo => {
      todo.completed = checked;
    });
  }

  get hasTodoItems() {
    return this.items.length > 0;
  }

  get remainingTodos() {
    return this.items.filter(t => !t.completed).length;
  }

  private load(): TodoItem[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  private nextId() {
    if (this.items.length > 0) {
      return Math.max.apply(Math, this.items.map(t => t.id)) + 1;
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
