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
  shadow?: boolean | ShadowDomOptions;
  host?: d.HostMeta;
  assetsDir?: string;
  assetsDirs?: string[];
}
export interface ShadowDomOptions {
  delegatesFocus?: boolean;
}

export interface PropDecorator {
  (opts?: PropOptions): PropertyDecorator;
}
export interface PropOptions {
  attr?: string;
  context?: string;
  connect?: string;
  mutable?: boolean;
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
  eventName?: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}


export interface StateDecorator {
  (): PropertyDecorator;
}


export interface WatchDecorator {
  (propName: string): CustomMethodDecorator<any>;
}
