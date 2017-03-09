import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonCardContent extends IonElement {

  render(): VNode {
    return h('.card-content');
  }

}

(<IonicComponent>IonCardContent).$annotations = {
  tag: 'ion-card-content'
};
