import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonList extends IonElement {

  render(): VNode {
    return h('.list', h('slot'));
  }

}

(<IonicComponent>IonList).$annotations = {
  tag: 'ion-list',
  preprocessStyles: [
    'list.scss',
    'list.md.scss',
  ]
};

