import { Component } from '../index';


@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss',
    wp: 'list.wp.scss'
  },
  shadow: false,
  host: {
    class: 'list'
  }
})
export class List {}
