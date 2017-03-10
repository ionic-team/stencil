import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonItem extends IonElement {

  render(): VNode {
    return h('.item', [
      h('slot', { attrs: { name: 'item-left' } }),
      h('div.item-inner', [
        h('div.input-wrapper', [
          h('ion-label', [
            h('slot')
          ]),
          h('slot', { attrs: { name: 'input' } }),
        ]),
        h('slot', { attrs: { name: 'item-right' } }),
        h('ion-reorder')
      ]),
      h('button-effect')
    ]);
  }

}

(<IonicComponent>IonItem).$annotations = {
  tag: 'ion-item',
  preprocessStyles: [
    'item.scss',
    'item.md.scss',
  ]
};
