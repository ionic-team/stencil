import { MockCustomElementRegistry, resetCustomElementRegistry } from './custom-element-registry';
import { MockCustomEvent, MockEvent, addEventListener, dispatchEvent, removeEventListener, resetEventListeners } from './event';
import { MockDocument, resetDocument } from './document';
import { MockElement } from './node';
import { MockHistory } from './history';
import { MockLocation } from './location';
import { MockNavigator } from './navigator';
import { MockPerformance, resetPerformance } from './performance';
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

  constructor(html: string | boolean = null) {
    if (html !== false) {
      this.document = new MockDocument(html, this) as any;
    } else {
      this.document = null;
    }
    this.performance = new MockPerformance();
    this.customElements = new MockCustomElementRegistry(this as any);
  }

  addEventListener(type: string, handler: (ev?: any) => void) {
    addEventListener(this, type, handler);
  }

  close() {
    resetWindow(this as any);
  }

  dispatchEvent(ev: MockEvent) {
    return dispatchEvent(this, ev);
  }

  fetch() {
    return Promise.resolve();
  }

  get globalThis() {
    return this;
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

  get location(): Location {
    let loc = locMap.get(this);
    if (loc == null) {
      loc = new MockLocation();
      locMap.set(this, loc);
    }
    return loc;
  }
  set location(val: Location) {
    if (typeof val === 'string') {
      let loc = locMap.get(this);
      if (loc == null) {
        loc = new MockLocation();
        locMap.set(this, loc);
      }
      loc.href = val;

    } else {
      locMap.set(this, val as any);
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

  get parent(): any {
    return null;
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

}

export function createWindow(html: string | boolean = null): Window {
  return new MockWindow(html) as any;
}

export function cloneWindow(srcWin: Window) {
  if (srcWin == null) {
    return null;
  }

  const clonedWin = new MockWindow(false);
  if (srcWin.document != null) {
    const clonedDoc = new MockDocument(false, clonedWin);
    clonedWin.document = clonedDoc as any;
    clonedDoc.documentElement = srcWin.document.documentElement.cloneNode(true) as any;

  } else {
    clonedWin.document = new MockDocument(null, clonedWin) as any;
  }
  return clonedWin;
}


export function cloneDocument(srcDoc: Document) {
  if (srcDoc == null) {
    return null;
  }

  const dstWin = cloneWindow(srcDoc.defaultView);
  return dstWin.document;
}


export function resetWindow(win: Window) {
  if (win != null) {
    resetCustomElementRegistry(win.customElements);
    resetDocument(win.document);
    resetPerformance(win.performance);

    for (const winProp in win) {
      if (winProp !== 'document' && winProp !== 'performance' && winProp !== 'customElements') {
        (win as any)[winProp] = undefined;
      }
    }

    resetEventListeners(win);

    historyMap.delete(win as any);
    htmlElementCstrMap.delete(win as any);
    localStorageMap.delete(win as any);
    locMap.delete(win as any);
    navMap.delete(win as any);
    sessionStorageMap.delete(win as any);
    eventClassMap.delete(win as any);
    customEventClassMap.delete(win as any);
  }
}
