import { Component, h } from '../index';

@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss',
    wp: 'card-content.wp.scss'
  },
  shadow: false,
  host: {
    class: 'card-content'
  }
})
export class CardContent {
  render() {
    return <slot></slot>;
  }
}
