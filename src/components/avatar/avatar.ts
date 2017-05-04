import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
    wp: 'avatar.wp.scss'
  },
  shadow: false
})
export class Avatar {
  render() {
    return h(this, Ionic.theme(this, 'avatar'),
      h('slot')
    );
  }
}
