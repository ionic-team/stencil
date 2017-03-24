import { Component } from '../../utils/decorators';


@Component({
  tag: 'ion-badge',
  modes: {
    ios: {
      styleUrls: ['badge.ios.scss']
    },
    md: {
      styleUrls: ['badge.md.scss']
    },
    wp: {
      styleUrls: ['badge.wp.scss']
    }
  }
})
export class IonBadge {}
