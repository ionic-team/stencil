import * as d from '.';


export type LazyBundlesRuntimeData = LazyBundleRuntimeData[];


export type LazyBundleRuntimeData = [
  /** bundleIds */
  any,
  ComponentLazyRuntimeMeta[]
];


export interface ComponentRuntimeMeta {
  attrNameToPropName?: Map<string, string>;
  cmpMembers?: d.ComponentRuntimeMembers;
  propNameToAttrName?: Map<string, string>;
  cmpHostListeners?: d.ComponentRuntimeHostListener[];
  isReflectingAttribute?: boolean;
  cmpScopedCssEncapsulation?: boolean;
  cmpShadowDomEncapsulation?: boolean;
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


export interface ComponentRuntimeHostListener {
  /**
   * event name (event type)
   */
  [0]: string;

  /**
   * class method to handle event
   */
  [1]: string;

  /**
   * disabled event
   */
  [2]?: boolean;

  /**
   * passive event option
   */
  [3]?: boolean;

  /**
   * capture event option
   */
  [4]?: boolean;
}


export type ModeBundleId = ModeBundleIds | string;


export interface ModeBundleIds {
  [modeName: string]: string;
}


export interface HostRef {
  ancestorHostElement?: d.HostElement;
  hasConnected?: boolean;
  hasRendered?: boolean;
  hostListenerEventToMethodMap?: Map<string, string>;
  isActiveRender?: boolean;
  isConstructingInstance?: boolean;
  lazyInstance?: d.ComponentInstance;
  instanceValues?: Map<string, any>;
  isQueuedForUpdate?: boolean;
  isShadowDom?: boolean;
  isScoped?: boolean;
  queuedReceivedHostEvents?: any[];
  onReadyPromise?: Promise<any>;
  onReadyResolve?: (elm: any) => void;
  useNativeShadowDom?: boolean;
  vdomListeners?: Map<string, Function>;
  vnode?: d.VNode;
  watchCallbacks?: Map<string, string[]>;
}

export interface PlatformRuntime {
  appMode?: string;
  isTmpDisconnected: boolean;
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
