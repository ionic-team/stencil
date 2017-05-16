import { Component } from '../index';


@Component({
  tag: 'ion-card-header',
  styleUrls: {
    ios: 'card-header.ios.scss',
    md: 'card-header.md.scss',
    wp: 'card-header.wp.scss'
  },
  shadow: false,
  host: {
    class: 'card-header'
  }
})
export class CardHeader {}
