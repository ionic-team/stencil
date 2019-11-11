import { ComponentCompilerMeta } from './component-compiler-meta';
import { ComponentRuntimeMeta } from './runtime';


export interface ComponentConstructor {
  is?: string;
  properties?: ComponentConstructorProperties;
  watchers?: ComponentConstructorWatchers;
  events?: ComponentConstructorEvent[];
  listeners?: ComponentConstructorListener[];
  style?: string;
  styleId?: string;
  encapsulation?: ComponentConstructorEncapsulation;
  observedAttributes?: string[];
  cmpMeta?: ComponentRuntimeMeta;
  isProxied?: boolean;
  isStyleRegistered?: boolean;
}

export interface ComponentConstructorWatchers {
  [propName: string]: string[];
}

export interface ComponentTestingConstructor extends ComponentConstructor {
  COMPILER_META: ComponentCompilerMeta;
  prototype?: {
    componentWillLoad?: Function;
    componentWillUpdate?: Function;
    componentWillRender?: Function;
    __componentWillLoad?: Function;
    __componentWillUpdate?: Function;
    __componentWillRender?: Function;
  };
}

export interface ComponentNativeConstructor extends ComponentConstructor {
  cmpMeta: ComponentRuntimeMeta;
}


export type ComponentConstructorEncapsulation = 'shadow' | 'scoped' | 'none';


export interface ComponentConstructorProperties {
  [propName: string]: ComponentConstructorProperty;
}


export interface ComponentConstructorProperty {
  attribute?: string;
  elementRef?: boolean;
  method?: boolean;
  mutable?: boolean;
  reflect?: boolean;
  state?: boolean;
  type?: ComponentConstructorPropertyType;
  watchCallbacks?: string[];
}

export type ComponentConstructorPropertyType = StringConstructor | BooleanConstructor | NumberConstructor | 'string' | 'boolean' | 'number';


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
  passive?: boolean;
}
