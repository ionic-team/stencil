

export class MockCustomElementRegistry {
  private _registry = new Map<string, { cstr: any, options: any }>();
  private _whenDefinedResolves = new Map<string, Function>();

  constructor(private win: Window) {}

  define(tagName: string, cstr: any, options?: any) {
    if (tagName.toLowerCase() !== tagName) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
    }

    this._registry.set(tagName, { cstr, options });

    const whenDefinedResolve = this._whenDefinedResolves.get(tagName);
    if (whenDefinedResolve != null) {
      whenDefinedResolve();
      this._whenDefinedResolves.delete(tagName);
    }

    if (this.win.document != null) {
      const components = this.win.document.querySelectorAll(tagName);
      components.forEach((component: any) => {
        if (typeof component.connectedCallback === 'function') {
          component.connectedCallback();
        }
      });
    }
  }

  get(tagName: string) {
    const def = this._registry.get(tagName.toLowerCase());
    if (def != null) {
      return def.cstr;
    }
    return undefined;
  }

  whenDefined(tagName: string) {
    tagName = tagName.toLowerCase();

    if (this._registry.has(tagName)) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this._whenDefinedResolves.set(tagName, resolve);
    });
  }

  $reset() {
    this._registry.clear();
    this._whenDefinedResolves.clear();
  }

}
