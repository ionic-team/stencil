import { IonElement, VNode } from '../../utils/ion-element';


export class IonBadge extends IonElement {

  connectedCallback() {
    this.connect(IonBadge.observedAttributes);
  }

  ionNode(h: any): VNode {
    return h(this);
  }

  static get observedAttributes() {
    return ['color', 'mode'];
  }

}
