import {
  AddEventListener,
  Config,
  CssClassMap,
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
  Config,
  CssClassMap,
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
