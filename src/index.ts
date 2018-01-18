import {
  AddEventListener,
  AppGlobal,
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  Config,
  CssClassMap,
  EventEmitter,
  EventListenerEnable,
  HydrateOptions,
  StencilSystem,
  VNodeData
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
