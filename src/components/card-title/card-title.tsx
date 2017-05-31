import { Component, h } from '../index';


@Component({
  tag: 'ion-card-title',
  styleUrls: {
    ios: 'card-title.ios.scss',
    md: 'card-title.md.scss',
    wp: 'card-title.wp.scss'
  },
  shadow: false,
  host: {
    theme: 'card-title'
  }
})
export class CardTitle {
  render() {
    return <slot></slot>;
  }
}
