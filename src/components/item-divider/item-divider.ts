import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-item-divider',
  styleUrls: {
    ios: 'item-divider.ios.scss',
    md: 'item-divider.md.scss',
    wp: 'item-divider.wp.scss'
  },
  shadow: false,
  host: {
    class: 'item item-divider'
  }
})
export class ItemDivider {
  render() {
    return [
      h('slot', { attrs: { name: 'start' } }),
      h('div.item-inner', [
          h('div.input-wrapper',
            h('slot')
          ),
          h('slot', { attrs: { name: 'end' } }),
          // h('ion-reorder')
        ]
      ),
      // h('div.button-effect')
    ];
  }
}
