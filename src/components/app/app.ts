import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonApp extends IonElement {

  render(): VNode {
    return h('.app');
  }

}


(<IonicComponent>IonApp).$annotations = {
  tag: 'ion-app',
  preprocessStyles: [
    'app.scss',
    'app.ios.scss',
    'app.md.scss',
    'app.wp.scss'
  ]
};
