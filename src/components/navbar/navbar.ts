import { Ionic } from '../../utils/global';
import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonNavbar extends IonElement {

  render(): VNode {
    const mode = Ionic().config.get('mode');

    const bgData = { class: {} };
    bgData.class[`toolbar-background-${mode}`] = true;

    const contentData = { class: {} };
    contentData.class[`toolbar-content-${mode}`] = true;

    return h('.toolbar', [
      h('div.toolbar-background', bgData),
      h('div.toolbar-content', contentData, [
        h('slot')
      ]),
    ]);
  }

}

(<IonicComponent>IonNavbar).$annotations = {
  tag: 'ion-navbar',
  modeStyles: {
    'ios': [
      'toolbar.ios.css'
    ],
    'md': [
      'toolbar.md.css'
    ],
    'wp': [
      'toolbar.wp.css'
    ]
  }
};
