import * as d from './index';


export interface AppGlobal {
  ael?: (elm: Element|Document|Window, eventName: string, cb: d.EventListenerCallback, opts?: d.ListenOptions) => void;
  resourcesUrl?: string;
  components?: d.ComponentHostData[];
  componentOnReady?: (elm: d.HostElement, resolve: (elm: d.HostElement) => void) => void;
  Context?: any;
  loadBundle?: (bundleId: string, dependents: string[], importFn: CjsImporterFn) => void;
  loaded?: boolean;
  h?: Function;
  initialized?: boolean;
  raf?: DomControllerCallback;
  rel?: (elm: Element|Document|Window, eventName: string, cb: d.EventListenerCallback, opts?: d.ListenOptions) => void;
  $r?: { 0: d.HostElement, 1: () => void }[];
}


export interface CoreContext {
  attr?: number;
  emit?: (elm: Element, eventName: string, data?: d.EventEmitterData) => void;
  enableListener?: EventListenerEnable;
  eventNameFn?: (eventName: string) => string;
  isClient?: boolean;
  isPrerender?: boolean;
  isServer?: boolean;
  window?: Window;
  location?: Location;
  document?: Document;
  mode?: string;
  queue?: d.QueueApi;
  resourcesUrl?: string;
  [contextId: string]: any;
}


export interface DomControllerCallback {
  (cb: d.RafCallback): number;
}


export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string|Element, passive?: boolean): void;
}


export interface CjsImporterFn {
  (exports: CjsExports, requirePoly: Function): void;
}


export interface CjsExports {
  [moduleId: string]: d.ComponentConstructor;
}

