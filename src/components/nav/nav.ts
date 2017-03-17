import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonNav extends IonElement {

  render(): VNode {
    return h('.nav');
  }

}

(<IonicComponent>IonNav).$annotations = {
  tag: 'ion-nav'
};
