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
    const vnodeData: VNodeData = { class: {} };
    const hostCss = vnodeData.class;
    const host = this;
    const role = host.role;
    const mode = host.mode;

    function setCssClass(type: string) {
      if (type) {
        type = type.toLocaleLowerCase();
        hostCss[`${role}-${type}`] = true;
        hostCss[`${role}-${type}-${mode}`] = true;
      }
    }

    hostCss[role] = true;
    hostCss[`${role}-${mode}`] = true;

    let size = host.large ? 'large' : host.small ? 'small' : 'default';
    setCssClass(size);

    let style = host.outline ? 'outline' : host.clear ? 'clear' : host.solid ? 'solid' : null;
    style = (role !== 'bar-button' && style === 'solid' ? 'default' : style);
    setCssClass(style);

    let display = host.block ? 'block' : host.full ? 'full' : null;
    setCssClass(display);

    if (host.round) {
      setCssClass('round');
    }

    if (host.strong) {
      setCssClass('strong');
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
