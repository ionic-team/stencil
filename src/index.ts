import {
  ComponentDecorator,
  ElementDecorator,
  EventDecorator,
  FunctionalComponent,
  HTMLStencilElement,
  JSX as LocalJSX,
  JSXBase,
  ListenDecorator,
  MethodDecorator,
  PropDecorator,
  RafCallback,
  StateDecorator,
  UserBuildConditionals,
  VNode,
  VNodeData,
  WatchDecorator
} from './declarations';

export {
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  ComponentInterface,
  StencilConfig as Config,
  EventEmitter,
  FunctionalComponent,
  QueueApi,
  JSX
} from './declarations';

/**
 * Build
 */
export declare const Build: UserBuildConditionals;

/**
 * Component
 */
export declare const Component: ComponentDecorator;

/**
 * Element
 */
export declare const Element: ElementDecorator;

/**
 * Event
 */
export declare const Event: EventDecorator;

/**
 * Listen
 */
export declare const Listen: ListenDecorator;

/**
 * Method
 */
export declare const Method: MethodDecorator;

/**
 * Prop
 */
export declare const Prop: PropDecorator;

/**
 * State
 */
export declare const State: StateDecorator;

/**
 * Watch
 */
export declare const Watch: WatchDecorator;

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
 * getElement
 */
export declare function getElement(ref: any): HTMLStencilElement;

/**
 * writeTask
 */
export declare function writeTask(task: RafCallback): void;

/**
 * readTask
 */
export declare function readTask(task: RafCallback): void;

/**
 * forceUpdate
 */
export declare function forceUpdate(ref: any): void;

/**
 * Host
 */
interface HostAttributes {
  class?: string | { [className: string]: boolean };
  style?: { [key: string]: string | undefined };
  ref?: (el: HTMLElement | null) => void;

  [prop: string]: any;
}

export declare const Host: FunctionalComponent<HostAttributes>;

/**
 * The "h" namespace is used to import JSX types for elements and attributes.
 * It is imported in order to avoid conflicting global JSX issues.
 */
export declare namespace h {
  export function h(sel: any): VNode;
  export function h(sel: Node, data: VNodeData): VNode;
  export function h(sel: any, data: VNodeData): VNode;
  export function h(sel: any, text: string): VNode;
  export function h(sel: any, children: Array<VNode | undefined | null>): VNode;
  export function h(sel: any, data: VNodeData, text: string): VNode;
  export function h(sel: any, data: VNodeData, children: Array<VNode | undefined | null>): VNode;
  export function h(sel: any, data: VNodeData, children: VNode): VNode;

  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements, JSXBase.IntrinsicElements {
      [tagName: string]: any;
    }
  }
}
