
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
  forEach: (children: VNode[], cb: (vnode: ChildNode, index: number, array: ChildNode[]) => void) => void;
  map: (children: VNode[], cb: (vnode: ChildNode, index: number, array: ChildNode[]) => ChildNode) => VNode[];
}

export interface FunctionalComponent<T = {}> {
  (props: T, children: VNode[], utils: FunctionalUtilities): VNode | VNode[];
}

export interface VNode {
  $tag$?: string | number | Function;
  $key$?: string | number;
  $text$?: string;
  $children$?: VNode[];
  $attrs$?: any;
  $name$?: string;
  $flags$: number;
  $elm$?: any;
}

export interface ChildNode {
  vtag?: string | number | Function;
  vkey?: string | number;
  vtext?: string;
  vchildren?: VNode[];
  vattrs?: any;
  vname?: string;
}
