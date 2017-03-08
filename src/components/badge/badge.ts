import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonBadge extends IonElement {

  render(): VNode {
    return h('.badge');
  }

}

(<IonicComponent>IonBadge).$annotations = {
  tag: 'ion-badge',
  preprocessStyles: [
    'badge.scss',
    'badge.ios.scss',
    'badge.md.scss',
    'badge.wp.scss'
  ]
};
