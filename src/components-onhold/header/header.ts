import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonHeader extends IonElement {

  render(): VNode {
    return h('.header');
  }

}

(<IonicComponent>IonHeader).$annotations = {
  tag: 'ion-header',
  cloak: false,
  shadow: false
};
