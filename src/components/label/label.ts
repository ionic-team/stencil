import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss',
    wp: 'label.wp.scss'
  },
  shadow: false,
  host: {
    class: 'label'
  }
})
export class Label {
  render() {
    return h('slot');
  }
}
