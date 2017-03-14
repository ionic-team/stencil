import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonBarButtons extends IonElement {

  render(): VNode {
    return h('.bar-buttons', h('slot'));
  }

}

(<IonicComponent>IonBarButtons).$annotations = {
  tag: 'ion-buttons',
  preprocessStyles: [
    'bar-buttons.ios.scss',
    'bar-buttons.md.scss',
    'bar-buttons.wp.scss',
  ],
  modeStyles: {
    'ios': [
      'bar-buttons.ios.css'
    ],
    'md': [
      'bar-buttons.md.css'
    ],
    'wp': [
      'bar-buttons.wp.css'
    ]
  }
};
