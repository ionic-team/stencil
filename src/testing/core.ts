import * as d from '../declarations';


export {
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  ComponentInstance as ComponentInterface,
  StencilConfig as Config,
  EventEmitter,
  FunctionalComponent,
  QueueApi,
  JSXBase,
} from '../declarations';

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

export * from './platform';
