import { Ionic } from '../../utils/global';
import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonTitle extends IonElement {
  render(): VNode {
    const mode = Ionic().config.getValue('mode');

    const titleData = { class: {} };
    titleData.class[`toolbar-title-${mode}`] = true;

    return h('.toolbar-title-', [
      h('div.toolbar-title', titleData, [
        h('slot')
      ])
    ]);
  }

}

(<IonicComponent>IonTitle).$annotations = {
  tag: 'ion-title',
  preprocessStyles: [
    'title.md.scss'
  ],
  modeStyleUrls: {
    'ios': [
      'title.ios.css'
    ],
    'md': [
      'title.md.css'
    ],
    'wp': [
      'title.wp.css'
    ]
  }
};

