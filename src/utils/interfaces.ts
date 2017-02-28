import { DomApi, VNode } from '../renderer/index';
import { Config } from './config';


export interface GlobalIonic {
  dom: DomApi;
  config: Config;
}


export interface Patch {
  (oldVnode: VNode | Element, vnode: VNode): VNode;
}
