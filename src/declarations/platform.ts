import * as d from './index';
import { RUNTIME_ERROR } from '../util/constants';


export interface PlatformApi {
  activeRender?: boolean;
  attachStyles?: (plt: PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta, modeName: string, elm: d.HostElement, customStyle?: any) => void;
  connectHostElement: (cmpMeta: d.ComponentMeta, elm: d.HostElement) => void;
  defineComponent: (cmpMeta: d.ComponentMeta, HostElementConstructor?: any) => void;
  domApi?: d.DomApi;
  emitEvent: (elm: Element, eventName: string, data: EventEmitterData) => void;
  getComponentMeta: (elm: Element) => d.ComponentMeta;
  getContextItem: (contextKey: string) => any;
  isClient?: boolean;
  isDefinedComponent?: (elm: Element) => boolean;
  isPrerender?: boolean;
  isServer?: boolean;
  loadBundle: (cmpMeta: d.ComponentMeta, modeName: string, cb: Function) => void;
  onAppLoad?: (rootElm: d.HostElement, styles: string[], failureDiagnostic?: d.Diagnostic) => void;
  onError: (err: Error, type?: RUNTIME_ERROR, elm?: d.HostElement, appFailure?: boolean) => void;
  propConnect: (ctrlTag: string) => PropConnect;
  queue: QueueApi;
  registerComponents?: (components?: d.LoadComponentRegistry[]) => d.ComponentMeta[];
  render?: d.RendererApi;
  tmpDisconnected?: boolean;

  ancestorHostElementMap?: WeakMap<d.HostElement, d.HostElement>;
  componentAppliedStyles?: WeakMap<Node, d.ComponentAppliedStyles>;
  defaultSlotsMap?: WeakMap<d.HostElement, d.DefaultSlot>;
  hasConnectedMap?: WeakMap<d.HostElement, boolean>;
  hasListenersMap?: WeakMap<d.HostElement, boolean>;
  hasLoadedMap?: WeakMap<d.HostElement, boolean>;
  hostElementMap?: WeakMap<d.ComponentInstance, d.HostElement>;
  instanceMap?: WeakMap<d.HostElement, d.ComponentInstance>;
  isDisconnectedMap?: WeakMap<d.HostElement, boolean>;
  isQueuedForUpdate?: WeakMap<d.HostElement, boolean>;
  namedSlotsMap?: WeakMap<d.HostElement, d.NamedSlots>;
  onReadyCallbacksMap?: WeakMap<d.HostElement, d.OnReadyCallback[]>;
  queuedEvents?: WeakMap<d.HostElement, any[]>;
  vnodeMap?: WeakMap<d.HostElement, d.VNode>;
  valuesMap?: WeakMap<d.HostElement, any>;
}


export interface QueueApi {
  add: (cb: Function, priority?: number) => void;
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
  components?: d.LoadComponentRegistry[];
  loadBundle?: (bundleId: string, dependents: string[], importFn: CjsImporterFn) => void;
  h?: Function;
  Context?: any;
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
  (cb: RafCallback): void;
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
