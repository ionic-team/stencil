import * as d from '@declarations';
import { getHostRef } from '../client';


export const getDoc = (elm?: Node) => elm.ownerDocument;

export const getWin = (elm?: Node) => getDoc(elm).defaultView;

export const getHead = (elm?: Node) => getDoc(elm).head;

export const writeTask = (cb: Function) => cb();

export const tick = {
  then(cb: Function) {
    cb();
  }
};

export const consoleError = (e: any) => console.error(e);

export const loadModule = (_a: any, _b: any) => Promise.resolve() as any;

const Context = {
  isServer: true,
  enableListener: () => console.log('TODO'),
  queue: {
    write: writeTask,
    read: writeTask,
    tick
  }
};

export const getContext = (ref: d.RuntimeRef, context: string) => {
  if (context === 'window') {
    return getWin(getHostRef(ref).hostElement);
  }
  if (context === 'document') {
    return getDoc(getHostRef(ref).hostElement);
  }
  if (context === 'isServer') {
    return true;
  }
  return (Context as any)[context];
};


export {
  plt,
  registerInstance,
  registerHost,
  supportsShadowDom,
  supportsListenerOptions,
  connectedCallback,
  createEvent,
  getConnect,
  getElement,
  setMode,
  getMode,
  getHostRef,
  styles,
  rootAppliedStyles,
  Build,
  Host,
  h
} from '../client';
