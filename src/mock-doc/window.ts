import { MockCustomElementRegistry } from './custom-element-registry';
import { MockCustomEvent, MockEvent, addEventListener, dispatchEvent, removeEventListener } from './event';
import { MockDocument } from './document';
import { MockElement } from './node';
import { MockHistory } from './history';
import { MockLocation } from './location';
import { MockNavigator } from './navigator';
import { MockPerformance } from './performance';
import { MockStorage } from './storage';


const historyMap = new WeakMap<MockWindow, MockHistory>();
const htmlElementCstrMap = new WeakMap<MockWindow, any>();
const localStorageMap = new WeakMap<MockWindow, MockStorage>();
const locMap = new WeakMap<MockWindow, MockLocation>();
const navMap = new WeakMap<MockWindow, MockNavigator>();
const sessionStorageMap = new WeakMap<MockWindow, MockStorage>();
const eventClassMap = new WeakMap<MockWindow, any>();
const customEventClassMap = new WeakMap<MockWindow, any>();


export class MockWindow {
  customElements: CustomElementRegistry;
  document: Document;
  performance: Performance;

  constructor(html: string = null) {
    this.document = new MockDocument(html, this) as any;
    this.performance = new MockPerformance();
    this.customElements = new MockCustomElementRegistry(this as any);
  }

  addEventListener(type: string, handler: (ev?: any) => void) {
    addEventListener(this, type, handler);
  }

  close() {
    this.$reset();
  }

  dispatchEvent(ev: MockEvent) {
    return dispatchEvent(this, ev);
  }

  fetch() {
    return Promise.resolve();
  }

  get history() {
    let hsty = historyMap.get(this);
    if (hsty == null) {
      hsty = new MockHistory();
      historyMap.set(this, hsty);
    }
    return hsty;
  }
  set history(hsty: any) {
    historyMap.set(this, hsty);
  }

  get localStorage() {
    let locStorage = localStorageMap.get(this);
    if (locStorage == null) {
      locStorage = new MockStorage();
      localStorageMap.set(this, locStorage);
    }
    return locStorage;
  }
  set localStorage(locStorage: any) {
    localStorageMap.set(this, locStorage);
  }

  get location() {
    let loc = locMap.get(this);
    if (loc == null) {
      loc = new MockLocation();
      locMap.set(this, loc);
    }
    return loc;
  }
  set location(val: any) {
    if (typeof val === 'string') {
      let loc = locMap.get(this);
      if (loc == null) {
        loc = new MockLocation();
        locMap.set(this, loc);
      }
      loc.href = val;

    } else {
      locMap.set(this, val);
    }
  }

  matchMedia() {
    return {
      matches: false
    };
  }

  get navigator() {
    let nav = navMap.get(this);
    if (nav == null) {
      nav = new MockNavigator();
      navMap.set(this, nav);
    }
    return nav;
  }
  set navigator(nav: any) {
    navMap.set(this, nav);
  }

  parent: any = null;

  removeEventListener(type: string, handler: any) {
    removeEventListener(this, type, handler);
  }

  requestAnimationFrame(cb: (timestamp: number) => void) {
    setTimeout(() => cb(Date.now()));
  }

  get self() {
    return this;
  }

  get sessionStorage() {
    let sessStorage = sessionStorageMap.get(this);
    if (sessStorage == null) {
      sessStorage = new MockStorage();
      sessionStorageMap.set(this, sessStorage);
    }
    return sessStorage;
  }
  set sessionStorage(locStorage: any) {
    sessionStorageMap.set(this, locStorage);
  }

  get top() {
    return this;
  }

  get window() {
    return this;
  }

  get CSS() {
    return {
      supports: () => true
    };
  }

  get HTMLElement() {
    let HtmlElementCstr = htmlElementCstrMap.get(this);
    if (HtmlElementCstr == null) {
      const ownerDocument = this.document;
      HtmlElementCstr = class extends MockElement {
        constructor() {
          super(ownerDocument, '');
        }
      };
      htmlElementCstrMap.set(this, HtmlElementCstr);
    }
    return HtmlElementCstr;
  }

  get Event() {
    const evClass = eventClassMap.get(this);
    if (evClass != null) {
      return evClass;
    }
    return MockEvent;
  }
  set Event(ev: any) {
    eventClassMap.set(this, ev);
  }

  get CustomEvent() {
    const custEvClass = customEventClassMap.get(this);
    if (custEvClass != null) {
      return custEvClass;
    }
    return MockCustomEvent;
  }
  set CustomEvent(custEvClass: any) {
    customEventClassMap.set(this, custEvClass);
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

  $reset() {
    if (this.customElements != null) {
      (customElements as MockCustomElementRegistry).$reset();
    }

    if (this.document != null) {
      ((this.document as any) as MockDocument).$reset();
    }

    if (this.performance != null) {
      (this.performance as MockPerformance).$reset();
    }

    historyMap.delete(this);
    htmlElementCstrMap.delete(this);
    localStorageMap.delete(this);
    locMap.delete(this);
    navMap.delete(this);
    sessionStorageMap.delete(this);
    eventClassMap.delete(this);
    customEventClassMap.delete(this);
  }

}
