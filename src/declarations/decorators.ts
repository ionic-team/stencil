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
  assetsDir?: string;
  assetsDirs?: string[];
}


export interface PropDecorator {
  (opts?: PropOptions): PropertyDecorator;
}
export interface PropOptions {
  attribute?: string;
  mutable?: boolean;
  reflect?: boolean;

  /** @deprecated: "attr" has been deprecated, please use "attribute" instead. */
  attr?: string;
  /** @deprecated "reflectToAttr" has been deprecated, please use "reflect" instead. */
  context?: string;
  /** @deprecated "reflectToAttr" has been deprecated, please use "reflect" instead. */
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
  eventName?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}


export interface ListenDecorator {
  (eventName: string, opts?: ListenOptions): CustomMethodDecorator<any>;
}
export interface ListenOptions {
  target?: ListenTargetOptions;
  capture?: boolean;
  passive?: boolean;
}

export type ListenTargetOptions = 'parent' | 'body' | 'document' | 'window';


export interface StateDecorator {
  (): PropertyDecorator;
}


export interface WatchDecorator {
  (propName: string): CustomMethodDecorator<any>;
}
