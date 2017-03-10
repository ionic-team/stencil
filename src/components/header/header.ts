import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonHeader extends IonElement {

  render(): VNode {
    return h('.header', h('slot'));
  }

}

(<IonicComponent>IonHeader).$annotations = {
  tag: 'ion-header',
  preprocessStyles: [
    'header.scss',
    'header.md.scss',
  ]
};
