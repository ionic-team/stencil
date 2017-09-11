import {
  AddEventListener,
  BuildConfig,
  ComponentDecorator,
  CssClassMap,
  DomController,
  ElementDecorator,
  EventListenerEnable,
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

export { register, render } from './testing/index';   // I really want @stencil/core/testing and not in here, but will worry about that later

export { createRenderer } from './server/index';

export interface HostElement extends HTMLElement {
  $instance: any;
}

export {
  AddEventListener,
  BuildConfig,
  CssClassMap,
  DomController,
  EventEmitter,
  EventListenerEnable,
  HydrateOptions,
  AppGlobal,
  StencilSystem,
  VNodeData
};
