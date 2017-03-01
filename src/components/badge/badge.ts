import { IonElement } from '../ion-element';
import { CreateElement, VNode } from '../../utils/interfaces';


export class IonBadge extends IonElement {

  ionNode(h: CreateElement) {
    return h('.badge', [
      h('slot')
    ]);
  }

  ionStyles() {
    return `
      :host {
        background: gray;
      }
      :host(.badge-md) {
        font-size: 14px;
      }
      :host(.badge-ios-primary),
      :host(.badge-md-primary) {
        color: white;
        background: blue;
      }
      :host(.badge-ios-secondary),
      :host(.badge-md-secondary) {
        color: white;
        background: green;
      }
      :host(.badge-ios-danger),
      :host(.badge-md-danger) {
        color: white;
        background: red;
      }
      :host(.badge-ios-dark),
      :host(.badge-md-dark) {
        color: white;
        background: black;
      }
    `;
  }

  connectedCallback() {
    this.connect(IonBadge.observedAttributes);
  }

  static get observedAttributes() {
    return ['color', 'mode'];
  }

}
