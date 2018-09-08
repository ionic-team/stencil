import * as d from '.';

export interface Hyperscript {
  (sel: any): VNode;
  (sel: Node, data: VNodeData): VNode;
  (sel: any, data: VNodeData): VNode;
  (sel: any, text: string): VNode;
  (sel: any, children: Array<VNode | undefined | null>): VNode;
  (sel: any, data: VNodeData, text: string): VNode;
  (sel: any, data: VNodeData, children: Array<VNode | undefined | null>): VNode;
  (sel: any, data: VNodeData, children: VNode): VNode;
}

declare global {
  export var h: Hyperscript;
}

export interface VNode extends d.FVNode {
  elm?: d.RenderNode;
}


export interface VNodeData {
  class?: {[className: string]: boolean};
  style?: any;
  [attrName: string]: any;
}


export type ChildType = VNode | number | string;
export type PropsType = VNodeProdData | number | string | null;

/**
 * used by production compiler
 */
export interface VNodeProdData {
  key?: string | number;
  class?: {[className: string]: boolean} | string;
  className?: {[className: string]: boolean} | string;
  style?: any;
  [key: string]: any;
}
