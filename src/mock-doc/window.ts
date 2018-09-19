import { MockCustomElementRegistry } from './custom-element-registry';
import { MockCustomEvent, MockEvent, addEventListener, dispatchEvent, removeEventListener } from './event';
import { MockDocument } from './document';
import { MockHistory } from './history';
import { MockLocation } from './location';
import { MockNavigator } from './navigator';
import { MockPerformance } from './performance';
import { MockStorage } from './storage';


export class MockWindow {

  addEventListener(type: string, handler: (ev?: any) => void) {
    addEventListener(this, type, handler);
  }

  private _customElements: MockCustomElementRegistry;
  get customElements() {
    if (!this._customElements) {
      this._customElements = new MockCustomElementRegistry();
    }
    return this._customElements;
  }
  set customElements(val: any) {
    this._customElements = val;
  }

  dispatchEvent(ev: MockEvent) {
    return dispatchEvent(this, ev);
  }

  private _document: Document;
  get document() {
    if (!this._document) {
      (this._document as any) = new MockDocument();
      (this._document as any).defaultView = this;
    }
    return this._document;
  }
  set document(value) {
    this._document = value;
    (this._document as any).defaultView = this;
  }

  fetch() {
    return Promise.resolve();
  }

  private _history: MockHistory;
  get history() {
    if (!this._history) {
      this._history = new MockHistory();
    }
    return this._history;
  }
  set history(value) {
    this._history = value;
  }

  private _localStorage: MockStorage;
  get localStorage() {
    if (!this._localStorage) {
      this._localStorage = new MockStorage();
    }
    return this._localStorage;
  }
  set localStorage(value) {
    this._localStorage = value;
  }

  private _location: MockLocation;
  get location() {
    if (!this._location) {
      this._location = new MockLocation();
    }
    return this._location;
  }
  set location(value) {
    this._location = value;
  }

  matchMedia() {
    return {
      matches: false
    };
  }

  private _navigator: MockNavigator;
  get navigator() {
    if (!this._navigator) {
      this._navigator = new MockNavigator();
    }
    return this._navigator;
  }
  set navigator(value) {
    this._navigator = value;
  }

  private _performance: any = null;
  get performance() {
    if (!this._performance) {
      this._performance = new MockPerformance();
    }
    return this._performance;
  }
  set performance(value) {
    this._performance = value;
  }

  private _parent: any = null;
  get parent() {
    return this._parent;
  }
  set parent(value) {
    this._parent = value;
  }

  removeEventListener(type: string, handler: any) {
    removeEventListener(this, type, handler);
  }

  requestAnimationFrame(cb: (timestamp: number) => void) {
    setTimeout(() => cb(Date.now()));
  }

  get self() {
    return this;
  }

  private _sessionStorage: MockStorage;
  get sessionStorage() {
    if (!this._sessionStorage) {
      this._sessionStorage = new MockStorage();
    }
    return this._sessionStorage;
  }
  set sessionStorage(val: any) {
    this._sessionStorage = val;
  }

  get top() {
    return this;
  }

  get window() {
    return this;
  }

  static get CSS() {
    return {
      supports: () => true
    };
  }

  private _MockEvent: MockEvent;
  get Event() {
    if (this._MockEvent) {
      return this._MockEvent;
    }
    return MockEvent;
  }
  set Event(value: any) {
    this._MockEvent = value;
  }

  private _MockCustomEvent: MockCustomEvent;
  get CustomEvent() {
    if (this._MockCustomEvent) {
      return this._MockCustomEvent;
    }
    return MockCustomEvent;
  }
  set CustomEvent(value: any) {
    this._MockCustomEvent = value;
  }
  getComputedStyle(_: any) {
    return {
      cssText: '',
      length: 0,
      parentRule: null,
      getPropertyPriority(): any {
        return null;
      },
      getPropertyValue(): any {
        return '';
      },
      item(): any {
        return null;
      },
      removeProperty(): any {
        return null;
      },
      setProperty(): any {
        return null;
      }
    } as any;
  }
}
