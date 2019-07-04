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
  $flags$: number;
  $hostElement$?: d.HostElement;
  $instanceValues$?: Map<string, any>;
  $lazyInstance$?: d.ComponentInterface;
  $onReadyPromise$?: Promise<any>;
  $onReadyResolve$?: (elm: any) => void;
  $vnode$?: d.VNode;
  $queuedListeners$?: [string, any][];
  $rmListeners$?: () => void;
  $modeName$?: string;
}

export interface PlatformRuntime {
  $flags$: number;
  $resourcesUrl$: string;
  jmp: (c: Function) => any;
  raf: (c: FrameRequestCallback) => number;
  ael: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  $orgLocNodes$?: Map<string, d.RenderNode>;
}

export type RefMap = WeakMap<any, HostRef>;

export type StyleMap = Map<string, CSSStyleSheet | string>;

export type RootAppliedStyleMap = WeakMap<Element, Set<string>>;

export type AppliedStyleMap = Set<string>;

export type ActivelyProcessingCmpMap = Set<Element>;
