import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss',
    wp: 'list.wp.scss'
  },
  shadow: false
})
export class List {
  render() {
    return h(this, Ionic.theme(this, 'list'));
  }
}
