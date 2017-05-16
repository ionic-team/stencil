import { Component } from '../index';


@Component({
  tag: 'ion-card',
  styleUrls: {
    ios: 'card.ios.scss',
    md: 'card.md.scss',
    wp: 'card.wp.scss'
  },
  shadow: false,
  host: {
    class: 'card'
  }
})
export class Card {}
