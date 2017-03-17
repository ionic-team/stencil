import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonBadge extends IonElement {

  render(): VNode {
    return h('.badge', h('slot'));
  }

}

(<IonicComponent>IonBadge).$annotations = {
  tag: 'ion-badge',
  preprocessStyles: [
    'badge.ios.scss',
    'badge.md.scss',
    'badge.wp.scss'
  ],
  modeStyleUrls: {
    'ios': [
      'badge.ios.css'
    ],
    'md': [
      'badge.md.css'
    ],
    'wp': [
      'badge.wp.css'
    ]
  }
};
