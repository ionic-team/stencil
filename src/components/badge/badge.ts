import { Component } from '../../utils/decorators';


@Component({
  tag: 'ion-badge',
  preprocessStyles: [
    'badge.ios.scss',
    'badge.ios.scoped.scss',
    'badge.md.scss',
    'badge.md.scoped.scss',
    'badge.wp.scss',
    'badge.wp.scoped.scss'
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

