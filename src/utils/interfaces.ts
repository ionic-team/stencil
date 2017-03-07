import { PlatformApi } from '../platform/platform-api';
import { Config } from './config';


export interface GlobalIonic {
  config?: Config;
  api?: PlatformApi;
  renderer?: Renderer;
}


export interface Renderer {
  (oldVnode: VNode | Element, vnode: VNode, slotProjection?: boolean): VNode;
}


export interface ComponentOptions {
  tag?: string;
  styleUrl?: string;
  preprocessStyles?: string[];
}


export interface PropOptions {
  type?: 'string' | 'boolean' | 'number' | 'Array' | 'Object';
}


export interface Props {
  [propName: string]: PropOptions;
}


export interface Annotations extends ComponentOptions {
  props?: Props;
  obsAttrs?: string[];
}


export type Key = string | number;


export interface VNode {
  sel: string | undefined;
  data: VNodeData | undefined;
  children: Array<VNode | string> | undefined;
  elm: Node | undefined;
  text: string | undefined;
  key: Key;
  isHost?: boolean;
  select?: string;
}


export interface VNodeData {
  // modules - use any because Object type is useless
  props?: any;
  attrs?: any;
  class?: any;
  style?: any;
  dataset?: any;
  on?: any;
  hero?: any;
  attachData?: any;
  hook?: Hooks;
  key?: Key;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: Array<any>; // for thunks
  [key: string]: any; // for any other 3rd party module
  // end of modules
}


export interface Module {
  pre: PreHook;
  create: CreateHook;
  update: UpdateHook;
  destroy: DestroyHook;
  remove: RemoveHook;
  post: PostHook;
}


export type PreHook = () => any;
export type InitHook = (vNode: VNode) => any;
export type CreateHook = (emptyVNode: VNode, vNode: VNode) => any;
export type InsertHook = (vNode: VNode) => any;
export type PrePatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type UpdateHook = (oldVNode: VNode, vNode: VNode) => any;
export type PostPatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type DestroyHook = (vNode: VNode) => any;
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => any;
export type PostHook = () => any;


export interface Hooks {
  pre?: PreHook;
  init?: InitHook;
  create?: CreateHook;
  insert?: InsertHook;
  prepatch?: PrePatchHook;
  update?: UpdateHook;
  postpatch?: PostPatchHook;
  destroy?: DestroyHook;
  remove?: RemoveHook;
  post?: PostHook;
}

