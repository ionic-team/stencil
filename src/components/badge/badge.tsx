import { Component, h } from '../index';

@Component({
  tag: 'ion-badge',
  styleUrls: {
    ios: 'badge.ios.scss',
    md: 'badge.md.scss',
    wp: 'badge.wp.scss'
  },
  shadow: false,
  host: {
    theme: 'badge'
  }
})
export class Badge {
  render() {
    return <slot></slot>;
  }
}
