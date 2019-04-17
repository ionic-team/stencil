import { createConsole } from './console';
import { MockCustomElementRegistry, resetCustomElementRegistry } from './custom-element-registry';
import { MockCustomEvent, MockEvent, addEventListener, dispatchEvent, removeEventListener, resetEventListeners } from './event';
import { MockDocument, resetDocument } from './document';
import { MockElement } from './node';
import { MockHistory } from './history';
import { MockLocation } from './location';
import { MockNavigator } from './navigator';
import { MockPerformance, resetPerformance } from './performance';
import { MockStorage } from './storage';
import { URL } from 'url';


const historyMap = new WeakMap<MockWindow, MockHistory>();
const htmlElementCstrMap = new WeakMap<MockWindow, any>();
const localStorageMap = new WeakMap<MockWindow, MockStorage>();
const locMap = new WeakMap<MockWindow, MockLocation>();
const navMap = new WeakMap<MockWindow, MockNavigator>();
const sessionStorageMap = new WeakMap<MockWindow, MockStorage>();
const eventClassMap = new WeakMap<MockWindow, any>();
const customEventClassMap = new WeakMap<MockWindow, any>();


export class MockWindow {
  console: Console;
  customElements: CustomElementRegistry;
  document: Document;
  performance: Performance;

  devicePixelRatio: number;
  innerHeight: number;
  innerWidth: number;
  pageXOffset: number;
  pageYOffset: number;
  screen: Screen;
  screenLeft: number;
  screenTop: number;
  screenX: number;
  screenY: number;
  scrollX: number;
  scrollY: number;

  constructor(html: string | boolean = null) {
    if (html !== false) {
      this.document = new MockDocument(html, this) as any;
    } else {
      this.document = null;
    }
    this.performance = new MockPerformance();
    this.customElements = new MockCustomElementRegistry(this as any);
    this.console = createConsole();
    resetWindowDimensions(this);
  }

  addEventListener(type: string, handler: (ev?: any) => void) {
    addEventListener(this, type, handler);
  }

  alert() {/**/}

  cancelAnimationFrame(id: any) {
    clearTimeout(id);
  }

  cancelIdleCallback(id: any) {
    clearTimeout(id);
  }

  clearInterval(id: any) {
    clearInterval(id);
  }

  clearTimeout(id: any) {
    clearTimeout(id);
  }

  close() {
    resetWindow(this as any);
  }

  confirm() {
    return false;
  }

  dispatchEvent(ev: MockEvent) {
    return dispatchEvent(this, ev);
  }

  fetch() {
    return Promise.reject(`fetch() unimplemented`);
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

  prompt() {
    return '';
  }

  get origin() {
    return this.location.origin;
  }

  removeEventListener(type: string, handler: any) {
    removeEventListener(this, type, handler);
  }

  requestAnimationFrame(callback: (timestamp: number) => void) {
    return setTimeout(() => callback(Date.now())) as number;
  }

  requestIdleCallback(callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void) {
    return setTimeout(() => callback({
      didTimeout: false,
      timeRemaining: () => 0
    })) as number;
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

  setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): number {
    return setInterval(callback, ms, ...args) as any;
  }

  setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number {
    return setTimeout(callback, ms, ...args) as any;
  }

  scroll(_x?: number, _y?: number) {/**/}

  scrollBy(_x?: number, _y?: number) {/**/}

  scrollTo(_x?: number, _y?: number) {/**/}

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

          const observedAttributes = (this.constructor as any).observedAttributes;
          if (Array.isArray(observedAttributes) && typeof (this as any).attributeChangedCallback === 'function') {
            observedAttributes.forEach(attrName => {
              const attrValue = this.getAttribute(attrName);
              if (attrValue != null) {
                (this as any).attributeChangedCallback(attrName, null, attrValue);
              }
            });
          }
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

  URL = URL;

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

/**
 * Constrain setTimeout() to 1ms, but still async. Also
 * only allow setInterval() to fire once, also constrained to 1ms.
 */
export function constrainTimeouts(win: any) {
  try {
    win.setTimeout = shortSetTimeout;
    win.setInterval = shortSetTimeout;
    win.clearInterval = shortClearTimeout;
  } catch (e) {}
}

function shortSetTimeout(callback: (...args: any[]) => void, _ms: number, ...args: any[]) {
  return setTimeout(callback, 1, ...args);
}

function shortClearTimeout(id: any) {
  clearTimeout(id);
}

export function resetWindow(win: Window) {
  if (win != null) {
    resetCustomElementRegistry(win.customElements);
    resetDocument(win.document);
    resetPerformance(win.performance);

    for (const key in win) {
      if (win.hasOwnProperty(key) && key !== 'document' && key !== 'performance' && key !== 'customElements') {
        delete (win as any)[key];
      }
    }

    resetWindowDimensions(win);

    resetEventListeners(win);

    historyMap.delete(win as any);
    htmlElementCstrMap.delete(win as any);
    localStorageMap.delete(win as any);
    locMap.delete(win as any);
    navMap.delete(win as any);
    sessionStorageMap.delete(win as any);
    eventClassMap.delete(win as any);
    customEventClassMap.delete(win as any);

    if (win.document != null) {
      try {
        (win.document as any).defaultView = win;
      } catch (e) {}
    }
  }
}

function resetWindowDimensions(win: any) {
  try {
    win.devicePixelRatio = 1;

    win.innerHeight = 768;
    win.innerWidth = 1366;

    win.pageXOffset = 0;
    win.pageYOffset = 0;

    win.screenLeft = 0;
    win.screenTop = 0;
    win.screenX = 0;
    win.screenY = 0;
    win.scrollX = 0;
    win.scrollY = 0;

    win.screen = {
      availHeight: win.innerHeight,
      availLeft: 0,
      availTop: 0,
      availWidth: win.innerWidth,
      colorDepth: 24,
      height: win.innerHeight,
      keepAwake: false,
      orientation: {
        angle: 0,
        type: 'portrait-primary'
      },
      pixelDepth: 24,
      width: win.innerWidth
    };
  } catch (e) {}
}
