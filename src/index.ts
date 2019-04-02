import * as d from './declarations';

export {
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  ComponentInstance as ComponentInterface,
  StencilConfig as Config,
  EventEmitter,
  EventListenerEnable,
  FunctionalComponent,
  QueueApi,
  JSXBase,
  Config as InternalConfig,
  Plugin,
  CompilerCtx,
  Module,
  ComponentCompilerMeta
} from './declarations';

/**
 * Build
 */
export declare const Build: d.UserBuildConditionals;

/**
 * Component
 */
export declare const Component: d.ComponentDecorator;

/**
 * Element
 */
export declare const Element: d.ElementDecorator;

/**
 * Event
 */
export declare const Event: d.EventDecorator;

/**
 * Listen
 */
export declare const Listen: d.ListenDecorator;

/**
 * Method
 */
export declare const Method: d.MethodDecorator;

/**
 * Prop
 */
export declare const Prop: d.PropDecorator;

/**
 * State
 */
export declare const State: d.StateDecorator;

/**
 * Watch
 */
export declare const Watch: d.WatchDecorator;

/**
 * setMode
 */
export declare const setMode: (handler: ((elm: HTMLElement) => string | undefined | null)) => void;

/**
 * getMode
 */
export declare function getMode<T = (string | undefined)>(ref: any): T;

/**
 * getAssetPath
 */
export declare function getAssetPath(path: string): string;

/**
 * getWindow
 */
export declare function getWindow(ref: any): Window;

/**
 * getDocument
 */
export declare function getDocument(ref: any): Document;

/**
 * Host
 */
export declare const Host: d.FunctionalComponent<any>;

export interface HostElement extends HTMLElement {}

declare namespace LocalJSX {
  interface Element {}
  interface IntrinsicElements {}
}

/**
 * The "h" namespace is used to import JSX types for elements and attributes.
 * It is imported in order to avoid conflicting global JSX issues.
 */
export declare namespace h {
  export function h(sel: any): d.VNode;
  export function h(sel: Node, data: d.VNodeData): d.VNode;
  export function h(sel: any, data: d.VNodeData): d.VNode;
  export function h(sel: any, text: string): d.VNode;
  export function h(sel: any, children: Array<d.VNode | undefined | null>): d.VNode;
  export function h(sel: any, data: d.VNodeData, text: string): d.VNode;
  export function h(sel: any, data: d.VNodeData, children: Array<d.VNode | undefined | null>): d.VNode;
  export function h(sel: any, data: d.VNodeData, children: d.VNode): d.VNode;

  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements, d.JSXBase.IntrinsicElements {
      [tagName: string]: any;
    }
  }
}

export { LocalJSX as JSX };
