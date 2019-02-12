
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

export interface VNode extends FVNode {
  elm?: any;
}


export interface VNodeData {
  class?: {[className: string]: boolean};
  style?: any;
  [attrName: string]: any;
}


export type ChildType = VNode | number | string;
export type PropsType = VNodeProdData | number | string | null;

export interface VNodeProdData {
  key?: string | number;
  class?: {[className: string]: boolean} | string;
  className?: {[className: string]: boolean} | string;
  style?: any;
  [key: string]: any;
}

export interface FunctionalUtilities {
  forEach: (children: FVNode[], cb: (vnode: ChildNode, index: number, array: FVNode[]) => void) => void;
  map: (children: FVNode[], cb: (vnode: ChildNode, index: number, array: FVNode[]) => ChildNode) => FVNode[];
}

export interface FunctionalComponent<T = {}> {
  (props: T, children: FVNode[], utils: FunctionalUtilities): FVNode | FVNode[];
}

export interface FVNode {
  // using v prefixes largely so closure has no issue property renaming
  vtag?: string | number | Function;
  vkey?: string | number;
  vtext?: string;
  vchildren?: FVNode[];
  vattrs?: any;
  vname?: string;
  ishost?: boolean;
  isSlotFallback?: boolean;
  isSlotReference?: boolean;
}

export interface ChildNode {
  vtag?: string | number | Function;
  vkey?: string | number;
  vtext?: string;
  vchildren?: ChildNode[];
  vattrs?: any;
  vname?: string;
}
