
export interface Ionic {
  staticDir?: string;
  components?: LoadComponents;
  loadComponents?: {(bundleId: string, componentModeData: any[]): void};
  config?: Object;
  configCtrl?: ConfigApi;
  domCtrl?: DomControllerApi;
  nextTickCtrl?: NextTickApi;
}


export interface NextTickApi {
  nextTick: NextTick;
}


export interface NextTick {
  (cb: Function): void;
}


export interface DomRead {
  (cb: Function): void;
}


export interface DomWrite {
  (cb: Function): void;
}


export interface DomControllerApi {
  read: DomRead;
  write: DomWrite;
}


export interface RafCallback {
  (timeStamp?: number): void;
}


export interface RequestAnimationFrame {
  (cb: RafCallback): void;
}


export interface LoadComponents {
  [tag: string]: any[]
}


export interface ConfigApi {
  get: (key: string, fallback?: any) => any;
}


export interface ComponentMeta {
  tag?: string;
  props?: Props;
  observedAttrs?: string[];
  hostCss?: string;
  componentModule?: any;
  modes: {[modeName: string]: ComponentMode};
}


export interface ComponentMode {
  isLoaded?: boolean;
  bundleId?: string;
  styles?: string;
  styleUrls?: string[];
  styleElm?: HTMLElement;
}


export interface ComponentInstance {
  render?: {(): VNode};

  mode?: string;
  color?: string;
}


export interface ComponentController {
  rootElm?: HTMLElement | ShadowRoot;
  queued?: boolean;
  instance?: ComponentInstance;
  vnode?: VNode;
}


export interface ComponentModule {
  new (): ComponentInstance;
}


export interface ComponentRegistry {
  [tag: string]: ComponentMeta;
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
  vdata: VNodeData | undefined;
  vchildren: Array<VNode | string> | undefined;
  elm: Node | undefined;
  vtext: string | undefined;
  vkey: Key;
}


export interface VNodeData {
  props?: any;
  attrs?: any;
  class?: any;
  style?: any;
  dataset?: any;
  on?: any;
  attachData?: any;
  vkey?: Key;
  vns?: string; // for SVGs
  [key: string]: any; // for any other 3rd party module
}
