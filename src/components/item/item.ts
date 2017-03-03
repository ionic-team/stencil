import { IonElement, h, VNode } from '../../element/ion-element';


export class IonItem extends IonElement {
  // '<ng-content select="[item-left],ion-checkbox:not([item-right])"></ng-content>' +
  // '<div class="item-inner">' +
  //   '<div class="input-wrapper">' +
  //     '<ng-content select="ion-label"></ng-content>' +
  //     '<ion-label *ngIf="_viewLabel">' +
  //       '<ng-content></ng-content>' +
  //     '</ion-label>' +
  //     '<ng-content select="ion-select,ion-input,ion-textarea,ion-datetime,ion-range,[item-content]"></ng-content>' +
  //   '</div>' +
  //   '<ng-content select="[item-right],ion-radio,ion-toggle"></ng-content>' +
  //   '<ion-reorder *ngIf="_hasReorder"></ion-reorder>' +
  // '</div>' +
  // '<div class="button-effect"></div>',
  render(): VNode {
    return h('.item', [
      h('slot', { select: '[item-left]' }),
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
