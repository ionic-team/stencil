import { Ionic } from '../../utils/global';
import { IonElement, IonicComponent, h, VNode } from '../../element/ion-element';


export class IonToolbar extends IonElement {
  render(): VNode {
    const mode = Ionic().config.get('mode');

    const bgData = { class: {} };
    bgData.class[`toolbar-background-${mode}`] = true;

    const contentData = { class: {} };
    contentData.class[`toolbar-content-${mode}`] = true;

    return h('.toolbar', [
      h('div.toolbar-background', bgData),
      h('div.toolbar-content', contentData, [
        h('slot')
      ]),
    ]);
  }

}

// '<div class="toolbar-background" [ngClass]="\'toolbar-background-\' + _mode"></div>' +
// '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
// '<ng-content select="ion-buttons[start]"></ng-content>' +
// '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
// '<div class="toolbar-content" [ngClass]="\'toolbar-content-\' + _mode">' +
//   '<ng-content></ng-content>' +
// '</div>'

(<IonicComponent>IonToolbar).$annotations = {
  tag: 'ion-toolbar',
  externalStyleUrls: [
    // '/dist/themes/ionic.css'
  ],
  preprocessStyles: [
    'toolbar.scss',
    'toolbar.ios.scss',
    'toolbar.md.scss',
    'toolbar.wp.scss',
    'toolbar-button.scss',
  ]
};

