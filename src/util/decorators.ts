import {
  ComponentDecorator,
  ElementDecorator,
  EventDecorator,
  ListenDecorator,
  MethodDecorator,
  PropDecorator,
  StateDecorator,
  WatchDecorator,
} from './interfaces';


export declare const Component: ComponentDecorator;

export declare const Element: ElementDecorator;

export declare const Event: EventDecorator;

export declare const Listen: ListenDecorator;

export declare const Method: MethodDecorator;

export declare const Prop: PropDecorator;

/**
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropWillChange: WatchDecorator;

/**
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropDidChange: WatchDecorator;

export declare const State: StateDecorator;

export declare const Watch: WatchDecorator;
