import * as d from './index';


export interface PlatformApi {
  activeRender?: boolean;
  attachStyles?: (plt: PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta, elm: d.HostElement) => void;
  customStyle?: any;
  defineComponent: (cmpMeta: d.ComponentMeta, HostElementConstructor?: any) => void;
  domApi?: d.DomApi;
  emitEvent: (elm: Element, eventName: string, data: d.EventEmitterData) => void;
  getComponentMeta: (elm: Element) => d.ComponentMeta;
  getContextItem: (contextKey: string) => any;
  isClient?: boolean;
  isDefinedComponent?: (elm: Element) => boolean;
  isPrerender?: boolean;
  isServer?: boolean;
  requestBundle: (cmpMeta: d.ComponentMeta, elm: d.HostElement) => void;
  onAppLoad?: (rootElm: d.HostElement, styles: string[], failureDiagnostic?: d.Diagnostic) => void;
  isAppLoaded?: boolean;
  onError: (err: Error, type?: number, elm?: d.HostElement, appFailure?: boolean) => void;
  propConnect: (ctrlTag: string) => PropConnect;
  queue: QueueApi;
  render?: d.RendererApi;
  tmpDisconnected?: boolean;
  nextId?: () => string;

  ancestorHostElementMap?: WeakMap<d.HostElement, d.HostElement>;
  componentAppliedStyles?: WeakMap<Node, d.ComponentAppliedStyles>;
  hasConnectedMap?: WeakMap<d.HostElement, boolean>;
  hasListenersMap?: WeakMap<d.HostElement, boolean>;
  hasLoadedMap?: WeakMap<d.HostElement, boolean>;
  hostSnapshotMap?: WeakMap<d.HostElement, d.HostSnapshot>;
  hostElementMap?: WeakMap<d.ComponentInstance, d.HostElement>;
  instanceMap?: WeakMap<d.HostElement, d.ComponentInstance>;
  isDisconnectedMap?: WeakMap<d.HostElement, boolean>;
  isQueuedForUpdate?: WeakMap<d.HostElement, boolean>;
  onReadyCallbacksMap?: WeakMap<d.HostElement, d.OnReadyCallback[]>;
  queuedEvents?: WeakMap<d.HostElement, any[]>;
  vnodeMap?: WeakMap<d.HostElement, d.VNode>;
  valuesMap?: WeakMap<d.HostElement, any>;
}


export interface QueueApi {
  tick: (cb: Function) => void;
  read: (cb: RafCallback) => void;
  write: (cb: RafCallback) => void;
  clear?: () => void;
  flush?: (cb?: Function) => void;
}


export interface PropConnect {
  create(opts?: any): Promise<any>;
  componentOnReady(): Promise<any>;
}


export interface Now {
  (): number;
}


export interface RafCallback {
  (timeStamp?: number): void;
}


export interface ImportedModule {
  [pascalCaseTag: string]: d.ComponentConstructor;
}


export interface RequestIdleCallback {
  (callback: IdleCallback, options?: { timeout?: number }): number;
}


export interface IdleCallback {
  (deadline: IdleDeadline, options?: IdleOptions): void;
}


export interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}


export interface IdleOptions {
  timeout?: number;
}


export type BundleCallback = [
  string | undefined,
  string[],
  Function
];
