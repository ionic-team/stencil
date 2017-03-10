import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonCard extends IonElement {

  render(): VNode {
    return h('.card');
  }

}

(<IonicComponent>IonCard).$annotations = {
  tag: 'ion-card',
  preprocessStyles: [
    'card.ios.scss',
    'card.md.scss',
    'card.wp.scss'
  ],
  modeStyles: {
    'ios': [
      'card.ios.css'
    ],
    'md': [
      'card.md.css'
    ],
    'wp': [
      'card.wp.css'
    ]
  }
};
