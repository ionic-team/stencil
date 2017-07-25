import { CssClassMap, VNode as IVNode } from '../../util/interfaces';


export class VNode implements IVNode {
  vtag: string;
  vtext: string;
  vchildren: VNode[];

  vclass: CssClassMap;
  vprops: any;
  vattrs: any;
  vstyle: any;
  vlisteners: any;
  vkey: any;
  vnamespace: any;

  elm: Element|Node;
  assignedListener: any;

  skipDataOnUpdate: boolean;
  skipChildrenOnUpdate: boolean;
}
