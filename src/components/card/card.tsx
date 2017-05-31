import { Component, h } from '../index';

@Component({
  tag: 'ion-card',
  styleUrls: {
    ios: 'card.ios.scss',
    md: 'card.md.scss',
    wp: 'card.wp.scss'
  },
  host: {
    theme: 'card'
  }
})
export class Card {
  render() {
    return <slot></slot>;
  }
}
