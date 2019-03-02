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

  page.waitForEvent = pageWaitForEvent.bind(page, page);
}


async function pageSpyOnEvent(page: pd.E2EPageInternal, eventName: string, selector: 'window' | 'document') {
  const eventSpy = new EventSpy(eventName);

  if (selector !== 'document') {
    selector = 'window';
  }

  const handle = await page.evaluateHandle(selector);

  await addE2EListener(page, handle, eventName, (ev: any) => {
    eventSpy.events.push(ev);
  });

  return eventSpy;
}


async function pageWaitForEvent(page: pd.E2EPageInternal, eventName: string, selector: 'window' | 'document') {
  if (selector !== 'document') {
    selector = 'window';
  }

  const ev = await page.evaluate((selector: string, eventName: string) => {

    return new Promise((resolve, reject) => {
      const tmr = setTimeout(() => {
        reject(`page.waitForEvent() timeout, eventName: ${eventName}, selector: ${selector}`);
      }, 10000);

      function listener(ev: any) {
        clearTimeout(tmr);
        (window as any)[selector].removeEventListener(eventName, listener);
        resolve((window as pd.BrowserWindow).stencilSerializeEvent(ev));
      }

      (window as any)[selector].addEventListener(eventName, listener);
    });

  }, selector, eventName);

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
      (window as pd.BrowserWindow).stencilOnEvent({
        id: id,
        event: (window as pd.BrowserWindow).stencilSerializeEvent(ev)
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

  window.addEventListener('appload', () => {
    // BROWSER CONTEXT
    (window as pd.BrowserWindow).stencilAppLoaded = true;
  });

  (window as pd.BrowserWindow).stencilSerializeEventTarget = (target: any) => {
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

  (window as pd.BrowserWindow).stencilSerializeEvent = (orgEv: any) => {
    // BROWSER CONTEXT
    const serializedEvent: d.SerializedEvent = {
      bubbles: orgEv.bubbles,
      cancelBubble: orgEv.cancelBubble,
      cancelable: orgEv.cancelable,
      composed: orgEv.composed,
      currentTarget: (window as pd.BrowserWindow).stencilSerializeEventTarget(orgEv.currentTarget),
      defaultPrevented: orgEv.defaultPrevented,
      detail: orgEv.detail,
      eventPhase: orgEv.eventPhase,
      isTrusted: orgEv.isTrusted,
      returnValue: orgEv.returnValue,
      srcElement: (window as pd.BrowserWindow).stencilSerializeEventTarget(orgEv.srcElement),
      target: (window as pd.BrowserWindow).stencilSerializeEventTarget(orgEv.target),
      timeStamp: orgEv.timeStamp,
      type: orgEv.type,
      isSerializedEvent: true
    };
    return serializedEvent;
  };
}
