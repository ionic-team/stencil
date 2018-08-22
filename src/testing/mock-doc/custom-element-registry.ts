

export class MockCustomElementRegistry {
  private ces = new Map<string, any>();

  define(name: string, cstr: any, _options?: any) {
    this.ces.set(name, cstr);
  }

  get(name: string) {
    return this.ces.get(name);
  }

  whenDefined(_name: string) {
    return Promise.resolve();
  }

}
