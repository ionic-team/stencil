import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonCardHeader extends IonElement {

  render(): VNode {
    return h('.card-header');
  }

}

(<IonicComponent>IonCardHeader).$annotations = {
  tag: 'ion-card-header'
};
