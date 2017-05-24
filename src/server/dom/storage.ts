

export class Storage {
  private items: {[key: string]: any} = {};

  /**
   * When passed a key name, will return that key's value.
   */
  getItem(key: string) {
    return this.items[key];
  }

  /**
   * When passed a key name and value, will add that key to the
   * storage, or update that key's value if it already exists.
   */
  setItem(key: string, value: any) {
    this.items[key] = value;
  }

  /**
   * When passed a key name, will remove that key from the storage.
   */
  removeItem(key: string) {
    delete this.items[key];
  }

  /**
   * When invoked, will empty all keys out of the storage.
   */
  clear() {
    this.items = {};
  }

  /**
   * When passed a number n, this method will return
   * the name of the nth key in the storage.
   */
  key(i: number) {
    const keys = Object.keys(this.items);
    return this.items[keys[i]];
  }

  /**
   * Returns an integer representing the number of
   * data items stored in the Storage object.
   */
  get length() {
    return Object.keys(this.items).length;
  }

}
