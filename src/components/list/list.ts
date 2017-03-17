import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonList extends IonElement {

  render(): VNode {
    return h('.list', h('slot'));
  }

}

(<IonicComponent>IonList).$annotations = {
  tag: 'ion-list',
  preprocessStyles: [
    'list.ios.scss',
    'list.md.scss',
    'list.wp.scss'
  ],
  modeStyleUrls: {
    'ios': [
      'list.ios.css'
    ],
    'md': [
      'list.md.css'
    ],
    'wp': [
      'list.wp.css'
    ]
  }
};

