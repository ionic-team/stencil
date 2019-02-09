import * as d from '.';


export type LazyBundlesRuntimeData = LazyBundleRuntimeData[];


export type LazyBundleRuntimeData = [
  /** bundleIds */
  any,
  ComponentLazyRuntimeMeta[]
];


export interface ComponentRuntimeMeta {
  cmpMembers?: d.ComponentRuntimeMembers;
  cmpHostListeners?: d.ComponentRuntimeHostListener[];
  cmpScopedCssEncapsulation?: boolean;
  cmpShadowDomEncapsulation?: boolean;


  // added later
  attrsToReflect?: [string, string][];
  watchers?: d.ComponentConstructorWatchers;
}


export interface ComponentLazyRuntimeMeta extends ComponentRuntimeMeta {
  cmpTag?: string;
  lazyBundleIds?: d.ModeBundleIds;
}


export interface ComponentRuntimeMembers {
  [memberName: string]: ComponentRuntimeMember;
}


export type ComponentRuntimeMember = [
  /**
   * flags data
   */
  number,

  /**
   * attribute name to observe
   */
  string?
];


export type ComponentRuntimeHostListener = [
  /**
   * event flags
   */
  number,

  /**
   * event name,
   */
  string,

  /**
   * event method,
   */
  string
];


export type ModeBundleId = ModeBundleIds | string;


export interface ModeBundleIds {
  [modeName: string]: string;
}

export type RuntimeRef = d.HostElement | {};

export interface HostRef {
  flags: number;
  ancestorHostElement?: d.HostElement;
  hostElement?: d.HostElement;
  lazyInstance?: d.ComponentInstance;
  hasInitializedComponent?: boolean;
  hasPostUpdatedComponent?: boolean;
  instanceValues?: Map<string, any>;
  queuedReceivedHostEvents?: any[];
  onReadyPromise?: Promise<any>;
  onReadyResolve?: (elm: any) => void;
  vnode?: d.VNode;
  watchCallbacks?: Map<string, string[]>;
}

export interface PlatformRuntime {
  appMode?: string;
  isTmpDisconnected?: boolean;
  queueCongestion?: number;
  queuePending?: boolean;
  supportsListenerOptions?: boolean;
  supportsShadowDom?: boolean;
}

export type RefMap = WeakMap<any, HostRef>;

export type StyleMap = Map<string, string>;

export type RootAppliedStyleMap = WeakMap<Element, Set<string>>;

export type AppliedStyleMap = Set<string>;

export type ActivelyProcessingCmpMap = Set<Element>;
