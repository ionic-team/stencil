import * as d from '../../declarations';
import * as pd from './puppeteer-declarations';
import * as puppeteer from 'puppeteer';


export async function initPageEvents(page: pd.E2EPageInternal) {
  page._e2eEvents = [];
  page._e2eEventIds = 0;

  await page.exposeFunction('stencilOnEvent', (browserEvent: pd.BrowserContextEvent) => {
    // NODE CONTEXT
    nodeContextEvents(page._e2eEvents, browserEvent);
  });

  await page.evaluateOnNewDocument(browserContextEvents);

  page.spyOnEvent = pageSpyOnEvent.bind(page, page);
}


async function pageSpyOnEvent(page: pd.E2EPageInternal, eventName: string, selector: 'window' | 'document') {
  const eventSpy = new EventSpy(eventName);

  const handler = (selector !== 'document')
    ? () => window
    : () => document;

  const handle = await page.evaluateHandle(handler);

  await addE2EListener(page, handle, eventName, (ev: any) => {
    eventSpy.events.push(ev);
  });

  return eventSpy;
}

export async function waitForEvent(page: pd.E2EPageInternal, eventName: string, elementHandle: puppeteer.ElementHandle) {
  const ev = await page.evaluate((element: Element, eventName: string) => {
    return new Promise<any>((resolve, reject) => {
      const tmr = setTimeout(() => {
        reject(`waitForEvent() timeout, eventName: ${eventName}`);
      }, 10000);

      element.addEventListener(eventName, ev => {
        clearTimeout(tmr);
        resolve((window as unknown as pd.BrowserWindow).stencilSerializeEvent(ev as any));
      }, {once: true});

    });
  }, elementHandle, eventName);

  await page.waitForChanges();
  return ev;
}


export class EventSpy implements d.EventSpy {
  events: d.SerializedEvent[] = [];

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
}


export async function addE2EListener(page: pd.E2EPageInternal, elmHandle: puppeteer.JSHandle, eventName: string, resolve: (ev: any) => void, cancelRejectId?: any) {
  // NODE CONTEXT
  const id = page._e2eEventIds++;

  page._e2eEvents.push({
    id: id,
    eventName: eventName,
    resolve: resolve,
    cancelRejectId: cancelRejectId
  });

  const executionContext = elmHandle.executionContext();

  // add element event listener
  await executionContext.evaluate((elm: any, id: number, eventName: string) => {
    elm.addEventListener(eventName, (ev: any) => {
      (window as unknown as pd.BrowserWindow).stencilOnEvent({
        id: id,
        event: (window as unknown as pd.BrowserWindow).stencilSerializeEvent(ev)
      });
    });
  }, elmHandle, id, eventName);
}


function nodeContextEvents(waitForEvents: pd.WaitForEvent[], browserEvent: pd.BrowserContextEvent) {
  // NODE CONTEXT
  const waitForEventData = waitForEvents.find(waitData => {
    return waitData.id === browserEvent.id;
  });

  if (waitForEventData) {
    if (waitForEventData.cancelRejectId != null) {
      clearTimeout(waitForEventData.cancelRejectId);
    }

    waitForEventData.resolve(browserEvent.event);
  }
}


function browserContextEvents() {
  // BROWSER CONTEXT

  const appLoaded = () => {
    (window as unknown as pd.BrowserWindow).stencilAppLoaded = true;
  };

  const domReady = () => {
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

    Promise.all(promises)
      .then(appLoaded)
      .catch(appLoaded);
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
    domReady();

  } else {
    window.document.addEventListener('DOMContentLoaded', domReady);
  }
}
