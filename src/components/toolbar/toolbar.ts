import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonToolbar extends IonElement {
  render(): VNode {
    return h('.toolbar');
  }

}

(<IonicComponent>IonToolbar).$annotations = {
  tag: 'ion-toolbar',
  preprocessStyles: [
    'toolbar.scss',
    'toolbar.ios.scss',
    'toolbar.md.scss',
    'toolbar.wp.scss',
    'toolbar-button.scss',
  ]
};

