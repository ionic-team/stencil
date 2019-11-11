import * as d from '../../declarations';
import * as pd from './puppeteer-declarations';
import * as puppeteer from 'puppeteer';


export async function initPageEvents(page: pd.E2EPageInternal) {
  page._e2eEvents = new Map();
  page._e2eEventIds = 0;
  page.spyOnEvent = pageSpyOnEvent.bind(page, page);

  await page.exposeFunction('stencilOnEvent', (id: number, ev: any) => {
    // NODE CONTEXT
    nodeContextEvents(page._e2eEvents, id, ev);
  });

  await page.evaluateOnNewDocument(browserContextEvents);
}


async function pageSpyOnEvent(page: pd.E2EPageInternal, eventName: string, selector: 'window' | 'document') {
  const eventSpy = new EventSpy(eventName);

  const handler = (selector !== 'document')
    ? () => window
    : () => document;

  const handle = await page.evaluateHandle(handler);

  await addE2EListener(page, handle, eventName, (ev) => {
    eventSpy.push(ev);
  });

  return eventSpy;
}

export async function waitForEvent(page: pd.E2EPageInternal, eventName: string, elementHandle: puppeteer.ElementHandle) {
  const timeoutMs = jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5;
  const ev = await page.evaluate((element: Element, eventName: string, timeoutMs: number) => {
    return new Promise<any>((resolve, reject) => {
      const tmr = setTimeout(() => {
        reject(new Error(`waitForEvent() timeout, eventName: ${eventName}`));
      }, timeoutMs);

      element.addEventListener(eventName, ev => {
        clearTimeout(tmr);
        resolve((window as unknown as pd.BrowserWindow).stencilSerializeEvent(ev as any));
      }, {once: true});

    });
  }, elementHandle, eventName, timeoutMs);

  await page.waitForChanges();
  return ev;
}


export class EventSpy implements d.EventSpy {
  events: d.SerializedEvent[] = [];
  private cursor = 0;
  private queuedHandler: (() => void)[] = [];
  constructor(public eventName: string) {}

  get length() {
    return this.events.length;
  }

  get firstEvent() {
    return this.events[0] || null;
  }

  get lastEvent() {
    return this.events[this.events.length - 1] || null;
  }

  next() {
    const cursor = this.cursor;
    this.cursor++;
    const next = this.events[cursor];
    if (next) {
      return Promise.resolve({
        done: false,
        value: next
      });
    } else {
      let resolve: () => void;
      const promise = new Promise(r => resolve = r);
      this.queuedHandler.push(resolve);
      return promise.then(() => ({
        done: false,
        value: this.events[cursor]
      }));
    }
  }

  push(ev: d.SerializedEvent) {
    this.events.push(ev);
    const next = this.queuedHandler.shift();
    if (next) {
      next();
    }
  }
}


export async function addE2EListener(page: pd.E2EPageInternal, elmHandle: puppeteer.JSHandle, eventName: string, callback: (ev: any) => void) {
  // NODE CONTEXT
  const id = page._e2eEventIds++;
  page._e2eEvents.set(id, {
    eventName,
    callback,
  });

  const executionContext = elmHandle.executionContext();

  // add element event listener
  await executionContext.evaluate((elm: any, id: number, eventName: string) => {
    elm.addEventListener(eventName, (ev: any) => {
      (window as unknown as pd.BrowserWindow).stencilOnEvent(
        id,
        (window as unknown as pd.BrowserWindow).stencilSerializeEvent(ev)
      );
    });
  }, elmHandle, id, eventName);
}


function nodeContextEvents(waitForEvents: Map<number, pd.WaitForEvent>, eventId: number, ev: any) {
  // NODE CONTEXT
  const waitForEventData = waitForEvents.get(eventId);
  if (waitForEventData) {
    waitForEventData.callback(ev);
  }
}


function browserContextEvents() {
  // BROWSER CONTEXT
  const waitFrame = () => {
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  };

  const allReady = () => {
    const promises: Promise<any>[] = [];
    const waitForDidLoad = (promises: Promise<any>[], elm: Element) => {
      if (elm != null && elm.nodeType === 1) {
        for (let i = 0; i < elm.children.length; i++) {
          const childElm = elm.children[i];
          if (childElm.tagName.includes('-') && typeof (childElm as any).componentOnReady === 'function') {
            promises.push((childElm as any).componentOnReady());
          }
          waitForDidLoad(promises, childElm);
        }
      }
    };

    waitForDidLoad(promises, window.document.documentElement);

    return Promise.all(promises)
      .catch((e) => console.error(e));
  };

  const stencilReady = () => {
    return allReady()
      .then(() => waitFrame())
      .then(() => allReady())
      .then(() => {
        (window as unknown as pd.BrowserWindow).stencilAppLoaded = true;
      });
  };

  (window as unknown as pd.BrowserWindow).stencilSerializeEventTarget = (target: any) => {
    // BROWSER CONTEXT
    if (!target) {
      return null;
    }
    if (target === window) {
      return { serializedWindow: true };
    }
    if (target === document) {
      return { serializedDocument: true };
    }
    if (target.nodeType != null) {
      const serializedElement: any = {
        serializedElement: true,
        nodeName: target.nodeName,
        nodeValue: target.nodeValue,
        nodeType: target.nodeType,
        tagName: target.tagName,
        className: target.className,
        id: target.id,
      };
      return serializedElement;
    }
    return null;
  };

  (window as unknown as pd.BrowserWindow).stencilSerializeEvent = (orgEv: any) => {
    // BROWSER CONTEXT
    const serializedEvent: d.SerializedEvent = {
      bubbles: orgEv.bubbles,
      cancelBubble: orgEv.cancelBubble,
      cancelable: orgEv.cancelable,
      composed: orgEv.composed,
      currentTarget: (window as unknown as pd.BrowserWindow).stencilSerializeEventTarget(orgEv.currentTarget),
      defaultPrevented: orgEv.defaultPrevented,
      detail: orgEv.detail,
      eventPhase: orgEv.eventPhase,
      isTrusted: orgEv.isTrusted,
      returnValue: orgEv.returnValue,
      srcElement: (window as unknown as pd.BrowserWindow).stencilSerializeEventTarget(orgEv.srcElement),
      target: (window as unknown as pd.BrowserWindow).stencilSerializeEventTarget(orgEv.target),
      timeStamp: orgEv.timeStamp,
      type: orgEv.type,
      isSerializedEvent: true
    };
    return serializedEvent;
  };

  if (window.document.readyState === 'complete') {
    stencilReady();

  } else {
    window.addEventListener('load', stencilReady);
  }
}
