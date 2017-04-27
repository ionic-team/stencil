import { Component, Ionic, Prop } from '../index';


/**
 * @name Navbar
 * @description
 * Navbar acts as the navigational toolbar, which also comes with a back
 * button. A navbar can contain a `ion-title`, any number of buttons,
 * a segment, or a searchbar. Navbars must be placed within an
 * `<ion-header>` in order for them to be placed above the content.
 * It's important to note that navbar's are part of the dynamic navigation
 * stack. If you need a static toolbar, use ion-toolbar.
 *
 * @usage
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <button ion-button icon-only menuToggle>
 *       <ion-icon name="menu"></ion-icon>
 *     </button>
 *
 *     <ion-title>
 *       Page Title
 *     </ion-title>
 *
 *     <ion-buttons end>
 *       <button ion-button icon-only (click)="openModal()">
 *         <ion-icon name="options"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * @demo /docs/demos/src/navbar/
 * @see {@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
@Component({
  tag: 'ion-navbar',
  // template:
  //   '<div class="toolbar-background" [ngClass]="\'toolbar-background-\' + _mode"></div>' +
  //   '<button (click)="backButtonClick($event)" ion-button="bar-button" class="back-button" [ngClass]="\'back-button-\' + _mode" [hidden]="_hideBb">' +
  //     '<ion-icon class="back-button-icon" [ngClass]="\'back-button-icon-\' + _mode" [name]="_bbIcon"></ion-icon>' +
  //     '<span class="back-button-text" [ngClass]="\'back-button-text-\' + _mode">{{_backText}}</span>' +
  //   '</button>' +
  //   '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
  //   '<ng-content select="ion-buttons[start]"></ng-content>' +
  //   '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
  //   '<div class="toolbar-content" [ngClass]="\'toolbar-content-\' + _mode">' +
  //     '<ng-content></ng-content>' +
  //   '</div>',
  // host: {
  //   '[hidden]': '_hidden',
  //   'class': 'toolbar',
  //   '[class.statusbar-padding]': '_sbPadding'
  // }
})
export class Navbar {
  _backText: string;
  _bbIcon: string;
  _hidden: boolean = false;
  _sbPadding: boolean;

  /**
   * @input {boolean} If true, the back button will be hidden.
   */
  @Prop() hideBackButton: boolean = false;

  constructor() {
    this._bbIcon = Ionic.config.get('backButtonIcon');
    this._sbPadding = Ionic.config.getBoolean('statusbarPadding');
    this._backText = Ionic.config.get('backButtonText', 'Back');
  }


  backButtonClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    // this.navCtrl && this.navCtrl.pop(null, null);
  }

  /**
   * Set the text of the Back Button in the Nav Bar. Defaults to "Back".
   */
  setBackButtonText(text: string) {
    this._backText = text;
  }

  /**
   * @hidden
   */
  didEnter() {
    // try {
    //   this._app.setTitle(this.getTitleText());
    // } catch (e) {
    //   console.error(e);
    // }
  }

  /**
   * @hidden
   */
  setHidden(isHidden: boolean) {
    // used to display none/block the navbar
    this._hidden = isHidden;
  }

}
