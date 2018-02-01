import * as d from '../declarations/index';


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
  // these must be "var" variables
  // so that they could be re-declared by
  // other collections, do not use "const" or "let"
  // "h" function is global so JSX doesn't throw typescript errors
  var h: Hyperscript;
}


export interface VNode {
  // using v prefixes largely so closure has no issue property renaming
  vtag?: string | number | Function;
  vkey?: string | number;
  vtext?: string;
  vchildren?: VNode[];
  vattrs?: any;
  vref?: (elm: any) => void;
  elm?: Element|Node;
}

export interface VNodeData {
  props?: any;
  attrs?: any;
  class?: d.CssClassMap;
  style?: any;
  on?: any;
  key?: Key;
  ns?: any; // for SVGs
}

/**
 * used by production compiler
 */
export interface VNodeProdData {
  key?: Key;
  class?: d.CssClassMap | string;
  className?: d.CssClassMap | string;
  style?: any;
  [key: string]: any;
}

export type Key = string | number;


export interface HostContentNodes {
  defaultSlot?: Node[];
  namedSlots?: {[slotName: string]: Node[]};
}
