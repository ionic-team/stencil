import { Config } from './config';


export interface Ionic {
  components?: {[tag: string]: any[]};
  config?: Config;
  loadComponent?: {(tag: string, mode: string, id: string, styles: string, moduleFn: Function): void};
}


export interface ComponentMeta {
  tag?: string;
  props?: Props;
  observedAttributes?: string[];
  hostCss?: string;
  module?: any;
  modes: {[mode: string]: ComponentMode};
}


export interface ComponentMode {
  loaded?: boolean;
  id?: string;
  styles?: string;
  styleUrls?: string[];
  styleElm?: HTMLStyleElement;
}


export interface ComponentInstance {
  connectedCallback?: {(): void};
  attributeChangedCallback?: {(attrName?: string, oldVal?: string, newVal?: string, namespace?: string): void};
  disconnectedCallback?: {(): void};
  render?: {(): VNode};

  mode?: string;
  color?: string;
}


export interface ComponentController {
  root?: HTMLElement | ShadowRoot;
  queued?: boolean;
  instance?: ComponentInstance;
  vnode?: VNode;
  connected?: boolean;
  state?: {[propName: string]: any};
}


export interface ComponentModule {
  new (): ComponentInstance;
}


export interface ComponentRegistry {
  [tag: string]: ComponentMeta;
}


export interface LoadComponentCallback {
  (cmpMeta: ComponentMeta, cmpMode: ComponentMode): void;
}


export interface PropOptions {
  type?: 'string' | 'boolean' | 'number' | 'Array' | 'Object';
}


export interface Props {
  [propName: string]: PropOptions;
}


export interface ProxyElement extends HTMLElement {
  connectedCallback: {(): void};
  attributeChangedCallback: {(attrName: string, oldVal: string, newVal: string, namespace: string): void};
  disconnectedCallback: {(): void};
}


export interface Renderer {
  (oldVnode: VNode | Element, vnode: VNode): VNode;
}


export type Key = string | number;


export interface VNode {
  sel: string | undefined;
  data: VNodeData | undefined;
  children: Array<VNode | string> | undefined;
  elm: Node | undefined;
  text: string | undefined;
  key: Key;
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
  key?: Key;
  ns?: string; // for SVGs
  [key: string]: any; // for any other 3rd party module
  // end of modules
}
