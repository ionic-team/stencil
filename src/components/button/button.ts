import { IonElement } from '../ion-element';
import { CreateElement, VNode } from '../../utils/interfaces';


export class IonButton extends IonElement {

  ionNode(h: CreateElement) {
    return h('.button', [
      h('span.button-inner', [
        h('slot')
      ]),
      h('div.button-effect')
    ]);
  }

  connectedCallback() {
    this.connect(IonButton.observedAttributes);
  }

  static get observedAttributes() {
    return ['color', 'mode'];
  }

}
