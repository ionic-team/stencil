import * as d from '.';


export type LazyBundlesRuntimeData = LazyBundleRuntimeData[];


export type LazyBundleRuntimeData = [
  /** bundleIds */
  any,
  ComponentRuntimeMetaCompact[]
];


export type ComponentRuntimeMetaCompact = [
  /** flags */
  number,

  /** tagname */
  string,

  /** members */
  {[memberName: string]: ComponentRuntimeMember}?,

  /** listeners */
  ComponentRuntimeHostListener[]?
];



export interface ComponentRuntimeMeta {
  $flags$: number;
  $tagName$: string;
  $members$?: ComponentRuntimeMembers;
  $listeners$?: ComponentRuntimeHostListener[];
  $attrsToReflect$?: [string, string][];
  $watchers$?: d.ComponentConstructorWatchers;
  $lazyBundleIds$?: d.ModeBundleIds;
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
  $ancestorComponent$?: d.HostElement;
  $stateFlags$: number;
  $hostElement$?: d.HostElement;
  $instanceValues$?: Map<string, any>;
  $lazyInstance$?: d.ComponentInstance;
  $onReadyPromise$?: Promise<any>;
  $onReadyResolve$?: (elm: any) => void;
  $vnode$?: d.VNode;
  $rmListeners$?: () => void;
  $modeName$?: string;
}

export interface PlatformRuntime {
  $resourcesUrl$?: string;
  $isTmpDisconnected$?: boolean;
  $orgLocNodes$?: Map<string, d.RenderNode>;
  $queueAsync$?: boolean;
  $queueCongestion$?: number;
  $queuePending$?: boolean;
}

export type RefMap = WeakMap<any, HostRef>;

export type StyleMap = Map<string, CSSStyleSheet | string>;

export type RootAppliedStyleMap = WeakMap<Element, Set<string>>;

export type AppliedStyleMap = Set<string>;

export type ActivelyProcessingCmpMap = Set<Element>;
