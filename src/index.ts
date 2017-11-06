import {
  AddEventListener,
  BuildConfig,
  CssClassMap,
  DomController,
  EventListenerEnable,
  EventEmitter,
  HydrateOptions,
  AppGlobal,
  StencilSystem,
  VNodeData,
  ComponentWillLoad,
  ComponentDidLoad,
  ComponentWillUpdate,
  ComponentDidUpdate,
  ComponentDidUnload
} from './util/interfaces';

export * from './util/decorators';

export interface HostElement extends HTMLElement {}

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
  VNodeData,
  ComponentWillLoad,
  ComponentDidLoad,
  ComponentWillUpdate,
  ComponentDidUpdate,
  ComponentDidUnload
};
