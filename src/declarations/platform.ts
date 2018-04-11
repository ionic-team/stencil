import * as d from './index';


export interface PlatformApi {
  activeRender?: boolean;
  attachStyles?: (plt: PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta, modeName: string, elm: d.HostElement, customStyle?: any) => void;
  defineComponent: (cmpMeta: d.ComponentMeta, HostElementConstructor?: any) => void;
  domApi?: d.DomApi;
  emitEvent: (elm: Element, eventName: string, data: EventEmitterData) => void;
  getComponentMeta: (elm: Element) => d.ComponentMeta;
  getContextItem: (contextKey: string) => any;
  isClient?: boolean;
  isDefinedComponent?: (elm: Element) => boolean;
  isPrerender?: boolean;
  isServer?: boolean;
  requestBundle: (cmpMeta: d.ComponentMeta, elm: d.HostElement, hostSnapshot: d.HostSnapshot) => void;
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
  componentOnReady(done: (cmp: any) => void): any;
}


export interface AddEventListener {
  (elm: Element|Document|Window, eventName: string, cb: EventListenerCallback, opts?: d.ListenOptions): Function;
}


export interface EventEmitter<T= any> {
  emit: (data?: T) => void;
}


export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string|Element, passive?: boolean): void;
}


export interface EventListenerCallback {
  (ev?: any): void;
}


export interface EventEmitterData<T = any> {
  detail?: T;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}


export interface AppGlobal {
  ael?: (elm: Element|Document|Window, eventName: string, cb: EventListenerCallback, opts?: d.ListenOptions) => void;
  components?: d.LoadComponentRegistry[];
  componentOnReady?: (elm: d.HostElement, resolve: (elm: d.HostElement) => void) => void;
  Context?: any;
  loadBundle?: (bundleId: string, dependents: string[], importFn: CjsImporterFn) => void;
  loaded?: boolean;
  h?: Function;
  initialized?: boolean;
  queue?: QueueApi;
  raf?: DomControllerCallback;
  rel?: (elm: Element|Document|Window, eventName: string, cb: EventListenerCallback, opts?: d.ListenOptions) => void;
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
  queue?: QueueApi;
  resourcesUrl?: string;
  [contextId: string]: any;
}


export interface CjsImporterFn {
  (exports: CjsExports, requirePoly: Function): void;
}


export interface CjsExports {
  [moduleId: string]: d.ComponentConstructor;
}


export interface Now {
  (): number;
}


export interface RafCallback {
  (timeStamp?: number): void;
}


export interface DomControllerCallback {
  (cb: RafCallback): number;
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
