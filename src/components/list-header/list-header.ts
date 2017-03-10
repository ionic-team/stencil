import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonListHeader extends IonElement {

  render(): VNode {
    return h('.list-header', h('slot'));
  }

}

(<IonicComponent>IonListHeader).$annotations = {
  tag: 'ion-list-header',
  preprocessStyles: [
    'list-header.scss',
    'list-header.md.scss',
  ]
};
