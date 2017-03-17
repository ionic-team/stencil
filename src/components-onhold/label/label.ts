import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonLabel extends IonElement {

  render(): VNode {
    return h('.label', h('slot'));
  }

}

(<IonicComponent>IonLabel).$annotations = {
  tag: 'ion-label',
  preprocessStyles: [
    'label.ios.scss',
    'label.md.scss',
    'label.wp.scss'
  ],
  modeStyleUrls: {
    'ios': [
      'label.ios.css'
    ],
    'md': [
      'label.md.css'
    ],
    'wp': [
      'label.wp.css'
    ]
  }
};
