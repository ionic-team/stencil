import * as d from '.';


declare type CustomMethodDecorator<T> = (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;


export interface ComponentDecorator {
  (opts?: ComponentOptions): ClassDecorator;
}
export interface ComponentOptions {
  tag: string;
  styleUrl?: string;
  styleUrls?: string[] | d.ModeStyles;
  styles?: string;
  scoped?: boolean;
  shadow?: boolean;
  assetsDirs?: string[];
  /**
   * @deprecated Use `assetsDirs` instead
   */
  assetsDir?: string;
}


export interface PropDecorator {
  (opts?: PropOptions): PropertyDecorator;
}
export interface PropOptions {
  attribute?: string;

  /**
   * A Prop is _by default_ immutable from inside the component logic.
   * Once a value is set by a user, the component cannot update it internally.
   * However, it's possible to explicitly allow a Prop to be mutated from inside the component,
   * by setting this `mutable` option to `true`.
   */
  mutable?: boolean;

  /**
   * In some cases it may be useful to keep a Prop in sync with an attribute.
   * In this case you can set the `reflect` option to `true`, since it defaults to `false`:
   */
  reflect?: boolean;

  /** @deprecated: "attr" has been deprecated, please use "attribute" instead. */
  attr?: string;
  /** @deprecated "context" has been deprecated. */
  context?: string;
  /** @deprecated "connect" has been deprecated, please use ES modules and/or dynamic imports instead. */
  connect?: string;
  /** @deprecated "reflectToAttr" has been deprecated, please use "reflect" instead. */
  reflectToAttr?: boolean;
}


export interface MethodDecorator {
  (opts?: MethodOptions): CustomMethodDecorator<any>;
}
export interface MethodOptions {}


export interface ElementDecorator {
  (): PropertyDecorator;
}


export interface EventDecorator {
  (opts?: EventOptions): PropertyDecorator;
}
export interface EventOptions {
  /**
   * A string custom event name to override the default.
   */
  eventName?: string;
  /**
   * A Boolean indicating whether the event bubbles up through the DOM or not.
   */
  bubbles?: boolean;

  /**
   * A Boolean indicating whether the event is cancelable.
   */
  cancelable?: boolean;

  /**
   * A Boolean value indicating whether or not the event can bubble across the boundary between the shadow DOM and the regular DOM.
   */
  composed?: boolean;
}


export interface ListenDecorator {
  (eventName: string, opts?: ListenOptions): CustomMethodDecorator<any>;
}
export interface ListenOptions {
  /**
   * Handlers can also be registered for an event other than the host itself.
   * The `target` option can be used to change where the event listener is attached,
   * this is useful for listening to application-wide events.
   */
  target?: ListenTargetOptions;

  /**
   * Event listener attached with `@Listen` does not "capture" by default,
   * When a event listener is set to "capture", means the event will be dispatched
   * during the "capture phase", check out https://www.quirksmode.org/js/events_order.html for further information.
   */
  capture?: boolean;

  /**
   * By default, Stencil uses several heuristics to determine if
   * it must attach a `passive` event listener or not.
   *
   * Using the `passive` option can be used to change the default behaviour.
   * Please check out https://developers.google.com/web/updates/2016/06/passive-event-listeners for further information.
   */
  passive?: boolean;
}

export type ListenTargetOptions = 'parent' | 'body' | 'document' | 'window';


export interface StateDecorator {
  (): PropertyDecorator;
}


export interface WatchDecorator {
  (propName: string): CustomMethodDecorator<any>;
}
