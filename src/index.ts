import {
  BuildConfig,
  ComponentDecorator,
  CssClassMap,
  ElementDecorator,
  EventDecorator,
  EventEmitter,
  HydrateOptions,
  ListenDecorator,
  MethodDecorator,
  AppGlobal,
  PropDecorator,
  PropChangeDecorator,
  StateDecorator,
  StencilSystem,
  VNodeData
} from './util/interfaces';


export declare const Component: ComponentDecorator;

export declare const Element: ElementDecorator;

export declare const Event: EventDecorator;

export declare const Listen: ListenDecorator;

export declare const Method: MethodDecorator;

export declare const Prop: PropDecorator;

export declare const PropWillChange: PropChangeDecorator;

export declare const PropDidChange: PropChangeDecorator;

export declare const State: StateDecorator;

export { build } from './compiler/index';

export { createRenderer } from './server/index';

export interface HostElement extends HTMLElement {
  $instance: any;
}

export {
  BuildConfig,
  CssClassMap,
  EventEmitter,
  HydrateOptions,
  AppGlobal,
  StencilSystem,
  VNodeData
};
