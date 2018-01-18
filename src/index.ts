import {
  AddEventListener,
  AppGlobal,
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  EventEmitter,
  EventListenerEnable
} from './util/interfaces';

export * from './util/decorators';

export interface HostElement extends HTMLElement {}

export {
  AddEventListener,
  EventEmitter,
  EventListenerEnable,
  AppGlobal,
  ComponentWillLoad,
  ComponentDidLoad,
  ComponentWillUpdate,
  ComponentDidUpdate,
  ComponentDidUnload
};


export * from './declarations/public';
