import { Component, h } from '../index';


@Component({
  tag: 'ion-page',
  styleUrls: {
    ios: 'page.ios.scss',
    md: 'page.md.scss',
    wp: 'page.wp.scss'
  },
  shadow: false,
  host: {
    theme: 'page'
  }
})
export class Page {
  render() {
    return <slot></slot>;
  }
}
