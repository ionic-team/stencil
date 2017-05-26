import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-page',
  styleUrls: {
    ios: 'page.ios.scss',
    md: 'page.md.scss',
    wp: 'page.wp.scss'
  }
})
export class Page {

  render() {
    return h(this, Ionic.theme(this, 'page'), h('slot'));
  }

}
