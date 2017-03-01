import { IonElement } from '../ion-element';
import { CreateElement, VNode } from '../../utils/interfaces';


export class IonBadge extends IonElement {

  ionNode(h: CreateElement) {
    return h('.badge', [
      h('slot')
    ]);
  }

  connectedCallback() {
    this.connect(IonBadge.observedAttributes);
  }

  static get observedAttributes() {
    return ['color', 'mode'];
  }

}
