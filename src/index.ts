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
  VNodeData
} from './util/interfaces';

export * from './util/decorators';

export { build } from './compiler/index';

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
