import * as d from '.';


export type LazyBundleRuntimeMeta = [
  /** bundleIds */
  any,
  ComponentLazyRuntimeMeta[]
];


export interface ComponentRuntimeMeta {
  members?: d.ComponentRuntimeMember[];
  scopedCssEncapsulation?: boolean;
  shadowDomEncapsulation?: boolean;
}


export interface ComponentLazyRuntimeMeta extends ComponentRuntimeMeta {
  cmpTag: string;
  lazyBundleIds?: d.BundleIds;
}


export interface ComponentRuntimeMember {
  /**
   * member name
   */
  [0]: string;

  /**
   * member type
   */
  [1]: number;

  /**
   * prop type
   */
  [2]?: number;

  /**
   * attribute name to observe
   */
  [3]?: string | 1 | 0;

  /**
   * reflect to attribute
   */
  [4]?: boolean;

}


export type ModeBundleId = ModeBundleIds | string;


export interface ModeBundleIds {
  [modeName: string]: string;
}


export interface ElementData {
  ancestorHostElement?: d.HostElement;
  elm?: d.HostElement;
  hasConnected?: boolean;
  hasRendered?: boolean;
  isActiveRender?: boolean;
  isConstructingInstance?: boolean;
  instance?: d.ComponentInstance;
  instanceValues?: Map<string, any>;
  isQueuedForUpdate?: boolean;
  isShadowDom?: boolean;
  isScoped?: boolean;
  listernProxies?: {[key: string]: Function};
  queuedEvents?: any[];
  onReadyPromise?: Promise<any>;
  onReadyResolve?: (elm: any) => void;
  useNativeShadowDom?: boolean;
  vnode?: d.VNode;
  watchCallbacks?: Map<string, string[]>;
}

export interface PlatformRuntime {
  appMode?: string;
  isTmpDisconnected: boolean;
  queueCongestion?: number;
  queuePending?: boolean;
  supportsShadowDom?: boolean;
}

export type RefMap = WeakMap<any, ElementData>;

export type StyleMap = Map<string, string>;

export type RootAppliedStyleMap = WeakMap<Element, Set<string>>;

export type AppliedStyleMap = Set<string>;

export type ActivelyProcessingCmpMap = Set<Element>;
