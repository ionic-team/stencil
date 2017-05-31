import { Component, h } from '../index';


@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
    wp: 'avatar.wp.scss'
  },
  host: {
    theme: 'avatar'
  }
})
export class Avatar {
  render() {
    return <slot></slot>;
  }
}
