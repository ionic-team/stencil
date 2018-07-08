import * as d from '.';


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export interface ComponentOptions {
  tag: string;
  styleUrl?: string;
  styleUrls?: string[] | d.ModeStyles;
  styles?: string;
  scoped?: boolean;
  shadow?: boolean;
  host?: d.HostMeta;
  assetsDir?: string;
  assetsDirs?: string[];
}


export interface PropDecorator {
  (opts?: PropOptions): any;
}


export interface PropOptions {
  attr?: string;
  context?: string;
  connect?: string;
  mutable?: boolean;
  reflectToAttr?: boolean;
}


export interface MethodDecorator {
  (opts?: MethodOptions): any;
}


export interface MethodOptions {}


export interface ElementDecorator {
  (): any;
}


export interface EventDecorator {
  (opts?: EventOptions): any;
}


export interface EventOptions {
  eventName?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}


export interface ListenDecorator {
  (eventName: string, opts?: ListenOptions): any;
}


export interface ListenOptions {
  eventName?: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}

export interface StateDecorator {
  (): any;
}


export interface WatchDecorator {
  (propName: string): any;
}
