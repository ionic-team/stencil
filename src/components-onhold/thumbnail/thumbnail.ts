import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonThumbnail extends IonElement {

  render(): VNode {
    return h('.thumbnail', h('slot'));
  }

}

(<IonicComponent>IonThumbnail).$annotations = {
  tag: 'ion-thumbnail',
  preprocessStyles: [
    'thumbnail.ios.scss',
    'thumbnail.md.scss',
    'thumbnail.wp.scss'
  ],
  modeStyleUrls: {
    'ios': [
      'thumbnail.ios.css'
    ],
    'md': [
      'thumbnail.md.css'
    ],
    'wp': [
      'thumbnail.wp.css'
    ]
  }
};
