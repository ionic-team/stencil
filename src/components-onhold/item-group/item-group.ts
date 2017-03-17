import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonItemGroup extends IonElement {

  render(): VNode {
    return h('.item-group', h('slot'));
  }

}

(<IonicComponent>IonItemGroup).$annotations = {
  tag: 'ion-item-group',
  preprocessStyles: [
    'item-group.ios.scss',
    'item-group.md.scss',
    'item-group.wp.scss'
  ],
  modeStyleUrls: {
    'ios': [
      'item-group.ios.css'
    ],
    'md': [
      'item-group.md.css'
    ],
    'wp': [
      'item-group.wp.css'
    ]
  }
};
