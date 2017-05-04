import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss',
    wp: 'label.wp.scss'
  },
  shadow: false
})
export class Label {
  render() {
    return h(this, Ionic.theme(this, 'label'),
      h('slot')
    );
  }
}
