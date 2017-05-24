import { Component, h } from '../index';


@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
    wp: 'avatar.wp.scss'
  },
  shadow: false,
  host: {
    class: 'avatar'
  }
})
export class Avatar {
  render() {
    return <slot></slot>;
  }
}
