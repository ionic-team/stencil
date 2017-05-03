import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-item-divider',
  styleUrls: {
    ios: 'item-divider.ios.scss',
    md: 'item-divider.md.scss',
    wp: 'item-divider.wp.scss'
  }
})
export class ItemDivider {
  render() {
    return h(this, Ionic.theme(this, 'item-divider'),
      h('slot')
    );
  }
}
