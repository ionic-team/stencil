import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonApp extends IonElement {

  render(): VNode {
    return h('.app', [
      h('slot')
    ]);
  }

}


(<IonicComponent>IonApp).$annotations = {
  tag: 'ion-app',
  cloak: false
};
