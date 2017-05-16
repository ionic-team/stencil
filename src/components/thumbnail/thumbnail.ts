import { Component, h } from '../index';


@Component({
  tag: 'ion-thumbnail',
  styleUrls: {
    ios: 'thumbnail.ios.scss',
    md: 'thumbnail.md.scss',
    wp: 'thumbnail.wp.scss'
  },
  shadow: false,
  host: {
    class: 'thumbnail'
  }
})
export class Thumbnail {
  render() {
    return h('slot');
  }
}
