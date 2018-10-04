
import * as d from './declarations/index';
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
  JSXElements,
  Hyperscript,
} from './declarations/index';

export namespace h {
  export namespace JSX {
    export interface IntrinsicElements extends d.JSXElements.DefaultIntrinsicElements, StencilIntrinsicElements {
    }
    export interface HTMLAttributes extends d.JSXElements.HTMLAttributes {
    }
  }
}
export var h: d.Hyperscript;

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
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropWillChange: d.WatchDecorator;

/**
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropDidChange: d.WatchDecorator;

export interface HostElement extends HTMLElement {}
