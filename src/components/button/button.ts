import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonButton extends IonElement {

  role = 'button';
  large: boolean;
  small: boolean;
  default: boolean;
  outline: boolean;
  clear: boolean;
  solid: boolean;
  round: boolean;
  block: boolean;
  full: boolean;
  strong: boolean;


  render(): VNode {
    const buttonInnerTag = 'a.button-inner';
    const hasButtonEffect = true;

    return h('.button', [
      h(buttonInnerTag, h('slot')),
      (hasButtonEffect) ? h('div.button-effect') : null
    ]);
  }

}

(<IonicComponent>IonButton).$annotations = {
  tag: 'ion-button',
  preprocessStyles: [
    'button.ios.scss',
    'button.md.scss',
    'button.wp.scss',
    // 'button-icon.scss',
  ],
  modeStyles: {
    'ios': [
      'button.ios.css'
    ],
    'md': [
      'button.md.css'
    ],
    'wp': [
      'button.wp.css'
    ]
  }
};
