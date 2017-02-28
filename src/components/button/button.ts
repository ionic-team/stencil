import { IonElement } from '../../utils/ion-element';
import { CreateElement, VNode } from '../../utils/interfaces';


export class IonButton extends IonElement {

  connectedCallback() {
    this.connect(IonButton.observedAttributes);
  }

  ionNode(h: CreateElement) {
    return h(this);
  }

  static get observedAttributes() {
    return ['color', 'mode'];
  }

}
