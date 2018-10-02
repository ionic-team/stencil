import * as d from '.';


export interface InternalMeta {
  ancestorHostElement: d.HostElement;
  hasConnected: boolean;
  hasListeners: boolean;
  isCmpLoaded: boolean;
  isCmpReady: boolean;
  cmpMeta: d.ComponentMeta;
  hostSnapshot: d.HostSnapshot;
  instance: d.ComponentInstance;
  element: d.HostElement;
  isDisconnected: boolean;
  isQueuedForUpdate: boolean;
  onReadyCallbacks: d.OnReadyCallback[];
  queuedEvents: any[];
  vnodeMap: d.VNode;
  valuesMap: any;
}

export interface PlatformApi {
  activeRender: boolean;
  attachStyles?: (plt: PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta, elm: d.HostElement) => void;
  customStyle?: any;
  defineComponent: (cmpMeta: d.ComponentMeta, HostElementConstructor?: any) => void;
  domApi: d.DomApi;
  emitEvent: (elm: Element, eventName: string, data: d.EventEmitterData) => CustomEvent;
  getComponentMeta: (elm: Element) => d.ComponentMeta;
  getContextItem: (contextKey: string) => any;
  isClient?: boolean;
  isDefinedComponent: (elm: Element) => boolean;
  isPrerender?: boolean;
  isServer?: boolean;
  requestBundle: (cmpMeta: d.ComponentMeta, meta: d.InternalMeta, hmrVersionId?: string) => void;
  onAppLoad?: (rootElm: d.HostElement, failureDiagnostic?: d.Diagnostic) => void;
  isAppLoaded: boolean;
  onError: (err: Error, type?: number, elm?: d.HostElement, appFailure?: boolean) => void;
  propConnect: (ctrlTag: string) => PropConnect;
  queue: d.QueueApi;
  render?: d.RendererApi;
  tmpDisconnected: boolean;
  nextId?: () => string;
  hasConnectedComponent?: boolean;

  metaHostMap: WeakMap<d.HostElement, InternalMeta>;
  metaInstanceMap: WeakMap<d.ComponentInstance, InternalMeta>;

  componentAppliedStyles: WeakMap<Node, d.ComponentAppliedStyles>;
  processingCmp: Set<d.HostElement>;
  onAppReadyCallbacks: Function[];
}


export interface PropConnect {
  create(opts?: any): Promise<any>;
  componentOnReady(): Promise<any>;
}


export interface Now {
  (): number;
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
