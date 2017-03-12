import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonAvatar extends IonElement {

  render(): VNode {
    return h('.avatar', h('slot'));
  }

}

(<IonicComponent>IonAvatar).$annotations = {
  tag: 'ion-avatar',
  preprocessStyles: [
    'avatar.ios.scss',
    'avatar.md.scss',
    'avatar.wp.scss'
  ],
  modeStyles: {
    'ios': [
      'avatar.ios.css'
    ],
    'md': [
      'avatar.md.css'
    ],
    'wp': [
      'avatar.wp.css'
    ]
  }
};
