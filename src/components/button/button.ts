import { IonElement, IonicComponent, h, VNode, VNodeData } from '../../element/ion-element';


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
    const host = this;
    const vnodeData: VNodeData = { attrs: {} };
    const attrs = vnodeData.attrs;

    if (host.large) {
      attrs['large'] = '';
    } else if (host.small) {
      attrs['small'] = '';
    }

    if (host.outline) {
      attrs['outline'] = '';
    } else if (host.clear) {
      attrs['clear'] = '';
    } else if (host.solid) {
      attrs['solid'] = '';
    }

    if (host.block) {
      attrs['block'] = '';
    } else if (host.full) {
      attrs['full'] = '';
    }

    if (host.round) {
      attrs['round'] = '';
    }

    if (host.strong) {
      attrs['strong'] = '';
    }

    const buttonInnerTag = 'a.button-inner';
    const hasButtonEffect = true;

    return h('.button', vnodeData, [
      h(buttonInnerTag, h('slot')),
      (hasButtonEffect) ? h('div.button-effect') : null
    ]);
  }

}

(<IonicComponent>IonButton).$annotations = {
  tag: 'ion-button',
  props: {
    role: {},
    large: {type: 'boolean'},
    small: {type: 'boolean'},
    default: {type: 'boolean'},
    outline: {type: 'boolean'},
    clear: {type: 'boolean'},
    solid: {type: 'boolean'},
    round: {type: 'boolean'},
    block: {type: 'boolean'},
    full: {type: 'boolean'},
    strong: {type: 'boolean'}
  },
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
