import { VNode as IVNode } from '../../util/interfaces';


export class VNode implements IVNode {
  vtag: string;
  vtext: string;
  vchildren: VNode[];

  vattrs: any;
  vkey: string | number;

  elm: Element|Node;
  assignedListener: any;
}
