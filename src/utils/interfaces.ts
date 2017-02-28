import { DomApi, VNode, VNodeData } from '../renderer/index';
import { Config } from './config';

export { VNode, VNodeData};


export interface GlobalIonic {
  dom: DomApi;
  config: Config;
}


export interface Patch {
  (oldVnode: VNode | Element, vnode: VNode): VNode;
}


export interface CreateElement {
  (ele: HTMLElement): VNode;
  (ele: HTMLElement, children: Array<VNode>): VNode;
  (sel: string): VNode;
  (sel: string, data: VNodeData): VNode;
  (sel: string, text: string): VNode;
  (sel: string, children: Array<VNode>): VNode;
  (sel: string, data: VNodeData, text: string): VNode;
  (sel: string, data: VNodeData, children: Array<VNode>): VNode;
}
