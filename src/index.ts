
import * as d from './declarations/index';

export {
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  Config,
  EventEmitter,
  EventListenerEnable,
  FunctionalComponent,
  QueueApi
} from './declarations/index';


/**
 * Public Stencil Config
 */
import { StencilConfig as SC } from './declarations/index';

declare global {
  type StencilConfig = SC;
}

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
