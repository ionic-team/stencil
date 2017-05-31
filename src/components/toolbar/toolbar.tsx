import { Component, h, Ionic } from '../index';
import { createThemedClasses } from '../../util/theme';


/**
 * @name Toolbar
 * @description
 * A Toolbar is a generic bar that is positioned above or below content.
 * Unlike a [Navbar](../../navbar/Navbar), a toolbar can be used as a subheader.
 * When toolbars are placed within an `<ion-header>` or `<ion-footer>`,
 * the toolbars stay fixed in their respective location. When placed within
 * `<ion-content>`, toolbars will scroll with the content.
 *
 *
 * ### Buttons in a Toolbar
 * Buttons placed in a toolbar should be placed inside of the `<ion-buttons>`
 * element. An exception to this is a [menuToggle](../../menu/MenuToggle) button.
 * It should not be placed inside of the `<ion-buttons>` element. Both the
 * `<ion-buttons>` element and the `menuToggle` can be positioned inside of the
 * toolbar using different properties. The below chart has a description of each
 * property.
 *
 * | Property    | Description                                                                                                           |
 * |-------------|-----------------------------------------------------------------------------------------------------------------------|
 * | `start`     | Positions element to the left of the content in `ios` mode, and directly to the right in `md` and `wp` mode.    |
 * | `end`       | Positions element to the right of the content in `ios` mode, and to the far right in `md` and `wp` mode.        |
 * | `left`      | Positions element to the left of all other elements.                                                            |
 * | `right`     | Positions element to the right of all other elements.                                                           |
 *
 *
 * ### Header / Footer Box Shadow and Border
 * In `md` mode, the `<ion-header>` will receive a box-shadow on the bottom, and the
 * `<ion-footer>` will receive a box-shadow on the top.  In `ios` mode, the `<ion-header>`
 * will receive a border on the bottom, and the `<ion-footer>` will receive a border on the
 * top. Both the `md` box-shadow and the `ios` border can be removed by adding the `no-border`
 * attribute to the element.
 *
 * ```html
 * <ion-header no-border>
 *   <ion-toolbar>
 *     <ion-title>Header</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 * </ion-content>
 *
 * <ion-footer no-border>
 *   <ion-toolbar>
 *     <ion-title>Footer</ion-title>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 *
 * @usage
 *
 * ```html
 *
 * <ion-header no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>My Toolbar Title</ion-title>
 *   </ion-toolbar>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a subheader</ion-title>
 *   </ion-toolbar>
 *
 * <ion-header>
 *
 *
 * <ion-content>
 *
 *   <ion-toolbar>
 *     <ion-title>Scrolls with the content</ion-title>
 *   </ion-toolbar>
 *
 * </ion-content>
 *
 *
 * <ion-footer no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a footer</ion-title>
 *   </ion-toolbar>
 *
 * </ion-footer>
 *  ```
 *
 * @demo /docs/demos/src/toolbar/
 * @see {@link ../../navbar/Navbar/ Navbar API Docs}
 */
@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss',
    wp: 'toolbar.wp.scss'
  },
  shadow: false,
  host: {
    theme: 'toolbar'
  }
})
export class Toolbar {
  $el: HTMLElement;
  private sbPadding: boolean;

  mode: string;
  color: string;

  constructor() {
    this.sbPadding = Ionic.config.getBoolean('statusbarPadding');
  }

  ionViewDidLoad() {
    /**
     * This is a platform specific hack that we would like to remove.  Currently this adds the
     * attribute button-type bar-button to all ion-buttons that exist within a toolbar.
     */
    // const slot = <HTMLSlotElement>this.$el.shadowRoot.querySelector('slot');
    // const ionButtons = slot.assignedNodes()
    //   .filter((elmt: HTMLElement) => elmt.nodeType !== Node.TEXT_NODE)
    //   .reduce((nodeList: HTMLElement[], elmt: HTMLElement) => {
    //     return nodeList.concat(Array.prototype.slice.call(elmt.querySelectorAll('ion-button')));
    //   }, []);

    // ionButtons.forEach(btn => {
    //   btn.setAttribute('button-type', 'bar-button');
    // });
  }

  hostAttributes() {
    return {
      class: {
        'statusbar-padding': this.sbPadding
      }
    };
  }

  render() {
    const backgroundClasses = createThemedClasses(this.mode, this.color, 'toolbar-background');
    const contentClasses = createThemedClasses(this.mode, this.color, 'toolbar-content');

    return [
      <div class={{backgroundClasses}}></div>,
      <div class={{contentClasses}}>
        <slot></slot>
      </div>
    ];
  }
}
