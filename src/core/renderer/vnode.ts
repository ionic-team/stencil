import { CssClassObject, VNode as IVNode } from '../../util/interfaces';


export class VNode implements IVNode {
  vtag: string;
  vtext: string;
  vchildren: VNode[];

  vclass: CssClassObject;
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
