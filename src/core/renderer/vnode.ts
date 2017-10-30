import { VNode as IVNode } from '../../util/interfaces';


export class VNode implements IVNode {
  vtag: string;
  vtext: string;
  vchildren: VNode[];

  vattrs: any;
  vkey: string | number;
  vref: (elm: HTMLElement) => void;

  elm: Element|Node;
}
