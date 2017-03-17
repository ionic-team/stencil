import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonListHeader extends IonElement {

  render(): VNode {
    return h('.list-header', h('slot'));
  }

}

(<IonicComponent>IonListHeader).$annotations = {
  tag: 'ion-list-header',
  preprocessStyles: [
    'list-header.ios.scss',
    'list-header.md.scss',,
    'list-header.wp.scss',
  ],
  modeStyleUrls: {
    'ios': [
      'list-header.ios.css'
    ],
    'md': [
      'list-header.md.css'
    ],
    'wp': [
      'list-header.wp.css'
    ]
  }
};
