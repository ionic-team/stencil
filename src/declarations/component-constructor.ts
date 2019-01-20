import * as d from '.';


export interface ComponentConstructor {
  is?: string;
  properties?: ComponentConstructorProperties;
  events?: ComponentConstructorEvent[];
  listeners?: ComponentConstructorListener[];
  style?: string;
  styleMode?: string;
  encapsulation?: ComponentConstructorEncapsulation;
  cmpMeta?: d.ComponentRuntimeMeta;
  observedAttributes?: string[];
}


export interface ComponentConstructorStaticMeta extends ComponentConstructor {
  CMP_META: d.ComponentCompilerMeta;
}


export type ComponentConstructorEncapsulation = 'shadow' | 'scoped' | 'none';


export interface ComponentConstructorProperties {
  [propName: string]: ComponentConstructorProperty;
}


export interface ComponentConstructorProperty {
  attr?: string;
  elementRef?: boolean;
  method?: boolean;
  mutable?: boolean;
  reflectToAttr?: boolean;
  state?: boolean;
  type?: ComponentConstructorPropertyType;
  watchCallbacks?: string[];
}

export type ComponentConstructorPropertyType = 'string' | 'boolean' | 'number';


export interface ComponentConstructorEvent {
  name: string;
  method: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
}


export interface ComponentConstructorListener {
  name: string;
  method: string;
  capture?: boolean;
  disabled?: boolean;
  passive?: boolean;
}
