import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonHeader extends IonElement {

  render(): VNode {
    return h('.header', h('slot'));
  }

}

(<IonicComponent>IonHeader).$annotations = {
  tag: 'ion-header',
  preprocessStyles: [
    'header.md.scss',
  ],
  modeStyles: {
    'ios': [
      'header.ios.css'
    ],
    'md': [
      'header.md.css'
    ],
    'wp': [
      'header.wp.css'
    ]
  },
  cloak: false
};
