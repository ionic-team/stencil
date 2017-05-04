import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-thumbnail',
  styleUrls: {
    ios: 'thumbnail.ios.scss',
    md: 'thumbnail.md.scss',
    wp: 'thumbnail.wp.scss'
  },
  shadow: false
})
export class Thumbnail {
  render() {
    return h(this, Ionic.theme(this, 'thumbnail'),
      h('slot')
    );
  }
}
