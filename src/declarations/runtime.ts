import { ComponentConstructorWatchers } from './component-constructor';
import { ComponentInterface } from './component-interfaces';
import { HostElement } from './host-element';
import { RenderNode } from './render';
import { VNode } from './vdom';
import { CssVarShim } from './css-var-shim';


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
  { [memberName: string]: ComponentRuntimeMember }?,

  /** listeners */
  ComponentRuntimeHostListener[]?
];



export interface ComponentRuntimeMeta {
  $flags$: number;
  $tagName$: string;
  $members$?: ComponentRuntimeMembers;
  $listeners$?: ComponentRuntimeHostListener[];
  $attrsToReflect$?: [string, string][];
  $watchers$?: ComponentConstructorWatchers;
  $lazyBundleIds$?: ModeBundleIds;
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

export type RuntimeRef = HostElement | {};

export interface HostRef {
  $ancestorComponent$?: HostElement;
  $flags$: number;
  $hostElement$?: HostElement;
  $instanceValues$?: Map<string, any>;
  $lazyInstance$?: ComponentInterface;
  $onReadyPromise$?: Promise<any>;
  $onReadyResolve$?: (elm: any) => void;
  $onInstancePromise$?: Promise<any>;
  $onInstanceResolve$?: (elm: any) => void;
  $onRenderResolve$?: () => void;
  $vnode$?: VNode;
  $queuedListeners$?: [string, any][];
  $rmListeners$?: () => void;
  $modeName$?: string;
  $renderCount$?: number;
}

export interface PlatformRuntime {
  $flags$: number;
  $resourcesUrl$: string;
  jmp: (c: Function) => any;
  raf: (c: FrameRequestCallback) => number;
  ael: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  $orgLocNodes$?: Map<string, RenderNode>;
  $cssShim$?: CssVarShim;
}

export type RefMap = WeakMap<any, HostRef>;

export type StyleMap = Map<string, CSSStyleSheet | string>;

export type RootAppliedStyleMap = WeakMap<Element, Set<string>>;

export type AppliedStyleMap = Set<string>;

export type ActivelyProcessingCmpMap = Set<Element>;
