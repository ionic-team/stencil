import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonItemDivider extends IonElement {

  render(): VNode {
    return h('.item-divider', h('slot'));
  }

}

(<IonicComponent>IonItemDivider).$annotations = {
  tag: 'ion-item-divider',
  preprocessStyles: [
    'item-divider.ios.scss',
    'item-divider.md.scss',
    'item-divider.wp.scss'
  ],
  modeStyles: {
    'ios': [
      'item-divider.ios.css'
    ],
    'md': [
      'item-divider.md.css'
    ],
    'wp': [
      'item-divider.wp.css'
    ]
  }
};
