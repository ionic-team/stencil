import { EventListenerOptions } from './interfaces';


export function emitEvent(doc: HTMLDocument, elm: HTMLElement, eventName: string, data?: any) {
  if (elm) {
    const ev = doc.createEvent('CustomEvent');
    ev.initCustomEvent(eventName, true, true, data);
    elm.dispatchEvent(ev);
  }
}


export function listenEvent(elm: HTMLElement, eventName: string, cb: {(ev?: any): void}, opts: EventListenerOptions = {}, supportsOpts: boolean) {
  if (!supportsOpts) {
    opts = !!opts.capture;
  }

  console.debug('addEventListener', eventName);
  elm.addEventListener(eventName, cb, (<any>opts));

  return function removeListener() {
    if (elm) {
      console.debug('removeEventListener', eventName);
      elm.removeEventListener(eventName, cb, (<any>opts));
    }
  };
}


export function pointerCoordX(ev: any): number {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientX;
    }
    if (ev.pageX !== undefined) {
      return ev.pageX;
    }
  }
  return 0;
}


export function pointerCoordY(ev: any): number {
  // get Y coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientY;
    }
    if (ev.pageY !== undefined) {
      return ev.pageY;
    }
  }
  return 0;
}
