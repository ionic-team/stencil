import { IonElement, h, VNode } from '../../element/ion-element';


export class IonItem extends IonElement {
  render(): VNode {
    return h('.item', [
      h('slot', { select: '[item-left],ion-checkbox:not([item-right])' }),
      h('div.item-inner', [
        h('div.input-wrapper', [
          h('ion-label', [
            h('slot')
          ]),
          h('slot', { select: 'ion-select,ion-input,ion-textarea,ion-datetime,ion-range,[item-content]' })
        ]),
        h('slot', { select: '[item-right],ion-radio,ion-toggle' }),
        h('ion-reorder')
      ]),
      h('button-effect')
    ]);
  }

}

IonItem.prototype['$css'] = `

`;
