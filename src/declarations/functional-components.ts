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
