import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonCardTitle extends IonElement {

  render(): VNode {
    return h('.card-title');
  }

}

(<IonicComponent>IonCardTitle).$annotations = {
  tag: 'ion-card-title'
};
