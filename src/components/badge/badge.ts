import { Component } from '../../utils/decorators';


@Component({
  tag: 'ion-badge',
  preprocessStyles: [
    'badge.ios.scss',
    'badge.md.scss',
    'badge.wp.scss'
  ],
  modeStyleUrls: {
    'ios': [
      'badge.ios.css'
    ],
    'md': [
      'badge.md.css'
    ],
    'wp': [
      'badge.wp.css'
    ]
  }
})
export class IonBadge {}

