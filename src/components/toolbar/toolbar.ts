import { Ionic } from '../../utils/global';
import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonToolbar extends IonElement {

  render(): VNode {
    const mode = Ionic().config.getValue('mode');

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


(<IonicComponent>IonToolbar).$annotations = {
  tag: 'ion-toolbar',
  preprocessStyles: [
    'toolbar.ios.scss',
    'toolbar.md.scss',
    'toolbar.wp.scss',
  ],
  modeStyleUrls: {
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

