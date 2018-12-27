import * as d from '.';


export interface ComponentRuntimeMeta {
  attrNameToPropName?: Map<string, string>;
  members?: d.ComponentRuntimeMember[];
  scopedDomEncapsulation?: boolean;
  shadowDomEncapsulation?: boolean;
}


export interface ComponentLazyRuntimeMeta extends ComponentRuntimeMeta {
  tagNameMeta?: string;
  lazyBundleIds?: ModeBundleId;
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
   * reflect to attribute
   */
  [2]: boolean;

  /**
   * is attribute name to observe
   */
  [3]: string;

  /**
   * prop type
   */
  [4]: number;
}


export type ModeBundleId = ModeBundleIds | string;


export interface ModeBundleIds {
  [modeName: string]: string;
}


export interface ElementData {
  ancestorHostElement?: d.HostElement;
  elm?: d.HostElement;
  firedDidLoad?: boolean;
  hasConnected?: boolean;
  hasRendered?: boolean;
  isActiveRender?: boolean;
  isConstructingInstance?: boolean;
  instance?: d.ComponentInstance;
  instanceValues?: Map<string, any>;
  isQueuedForUpdate?: boolean;
  isShadowDom?: boolean;
  isScoped?: boolean;
  queuedEvents?: any[];
  onReadyPromise?: Promise<any>;
  onReadyResolve?: (elm: any) => void;
  useNativeShadowDom?: boolean;
  vnode?: d.VNode;
  watchCallbacks?: Map<string, string[]>;
}

export interface PlatformRuntime {
  isTmpDisconnected: boolean;
}

export type RefMap = WeakMap<any, ElementData>;

export type StyleMap = Map<string, string>;

export type RootAppliedStyleMap = WeakMap<Element, Set<string>>;

export type AppliedStyleMap = Set<string>;
