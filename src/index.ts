
import * as d from './declarations/index';

import './declarations/jsx';

export {
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  Config,
  CssClassMap,
  EventEmitter,
  EventListenerEnable
} from './declarations';

export declare const Component: d.ComponentDecorator;

export declare const Element: d.ElementDecorator;

export declare const Event: d.EventDecorator;

export declare const Listen: d.ListenDecorator;

export declare const Method: d.MethodDecorator;

export declare const Prop: d.PropDecorator;

/**
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropWillChange: d.WatchDecorator;

/**
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropDidChange: d.WatchDecorator;

export declare const State: d.StateDecorator;

export declare const Watch: d.WatchDecorator;

export interface HostElement extends HTMLElement {}
