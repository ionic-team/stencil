import { Component, h, Ionic, Prop } from '../index';
import { ContentDimensions, ScrollDetail } from '../../util/interfaces';
import { Scroll } from '../scroll/scroll-interface';


/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area with
 * some useful methods to control the scrollable area. There should
 * only be one content in a single view component. If additional scrollable
 * elements are need, use [ionScroll](../../scroll/Scroll).
 *
 *
 * The content area can also implement pull-to-refresh with the
 * [Refresher](../../refresher/Refresher) component.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Add your content here!
 * </ion-content>
 * ```
 *
 * To get a reference to the content component from a Page's logic,
 * you can use Angular's `@ViewChild` annotation:
 *
 * ```ts
 * import { Component, ViewChild } from '@angular/core';
 * import { Content } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage{
 *   @ViewChild(Content) content: Content;
 *
 *   scrollToTop() {
 *     this.content.scrollToTop();
 *   }
 * }
 * ```
 *
 * @advanced
 *
 * Resizing the content. If the height of `ion-header`, `ion-footer` or `ion-tabbar`
 * changes dynamically, `content.resize()` has to be called in order to update the
 * layout of `Content`.
 *
 *
 * ```ts
 * @Component({
 *   template: `
 *     <ion-header>
 *       <ion-navbar>
 *         <ion-title>Main Navbar</ion-title>
 *       </ion-navbar>
 *       <ion-toolbar *ngIf="showToolbar">
 *         <ion-title>Dynamic Toolbar</ion-title>
 *       </ion-toolbar>
 *     </ion-header>
 *     <ion-content>
 *       <button ion-button (click)="toggleToolbar()">Toggle Toolbar</button>
 *     </ion-content>
 * `})
 *
 * class E2EPage {
 *   @ViewChild(Content) content: Content;
 *   showToolbar: boolean = false;
 *
 *   toggleToolbar() {
 *     this.showToolbar = !this.showToolbar;
 *     this.content.resize();
 *   }
 * }
 * ```
 *
 *
 * Scroll to a specific position
 *
 * ```ts
 * import { Component, ViewChild } from '@angular/core';
 * import { Content } from 'ionic-angular';
 *
 * @Component({
 *   template: `<ion-content>
 *                <button ion-button (click)="scrollTo()">Down 500px</button>
 *              </ion-content>`
 * )}
 * export class MyPage{
 *   @ViewChild(Content) content: Content;
 *
 *   scrollTo() {
 *     // set the scrollLeft to 0px, and scrollTop to 500px
 *     // the scroll duration should take 200ms
 *     this.content.scrollTo(0, 500, 200);
 *   }
 * }
 * ```
 *
 */
@Component({
  tag: 'ion-content',
  styleUrls: {
    ios: 'content.ios.scss',
    md: 'content.md.scss',
    wp: 'content.wp.scss'
  }
})
export class Content {
  $el: HTMLElement;
  $scroll: Scroll;
  $scrollDetail: ScrollDetail = {};
  $fixed: HTMLElement;
  $siblingHeader: HTMLElement;
  $siblingFooter: HTMLElement;

  /** @internal */
  _cTop: number;
  /** @internal */
  _cBottom: number;
  /** @internal */
  _pTop: number;
  /** @internal */
  _pRight: number;
  /** @internal */
  _pBottom: number;
  /** @internal */
  _pLeft: number;
  /** @internal */
  _scrollPadding: number = 0;
  /** @internal */
  _hdrHeight: number;
  /** @internal */
  _ftrHeight: number;
  /** @internal */
  _tabs: any;
  /** @internal */
  _tabbarHeight: number;
  /** @internal */
  _tabsPlacement: string;
  /** @internal */
  _tTop: number;
  /** @internal */
  _fTop: number;
  /** @internal */
  _fBottom: number;
  /** @internal */
  _inputPolling: boolean = false;
  /** @internal */
  _dirty: boolean;
  /** @internal */
  _viewCtrlReadSub: any;
  /** @internal */
  _viewCtrlWriteSub: any;
  /** @internal */
  _scrollDownOnLoad: boolean = false;

  /** @hidden */
  statusbarPadding: boolean;

  /**
   * Content height of the viewable area. This does not include content
   * which is outside the overflow area, or content area which is under
   * headers and footers. Read-only.
   *
   * @return {number}
   */
  get contentHeight(): number {
    return this.$scrollDetail.contentHeight;
  }

  /**
   * Content width including content which is not visible on the screen
   * due to overflow. Read-only.
   *
   * @return {number}
   */
  get contentWidth(): number {
    return this.$scrollDetail.contentWidth;
  }

  /**
   * A number representing how many pixels the top of the content has been
   * adjusted, which could be by either padding or margin. This adjustment
   * is to account for the space needed for the header.
   *
   * @return {number}
   */
  contentTop: number;

  /**
   * A number representing how many pixels the bottom of the content has been
   * adjusted, which could be by either padding or margin. This adjustment
   * is to account for the space needed for the footer.
   *
   * @return {number}
   */
  contentBottom: number;

  /**
   * Content height including content which is not visible on the screen
   * due to overflow. Read-only.
   *
   * @return {number}
   */
  get scrollHeight(): number {
    return this.$scrollDetail.scrollHeight;
  }

  /**
   * Content width including content which is not visible due to
   * overflow. Read-only.
   *
   * @return {number}
   */
  get scrollWidth(): number {
    return this.$scrollDetail.scrollWidth;
  }

  // /**
  //  * The distance of the content's top to its topmost visible content.
  //  *
  //  * @return {number}
  //  */
  // get scrollTop(): number {
  //   return this.$scrollDetail.scrollTop;
  // }
  // /**
  //  * @param {number} top
  //  */
  // set scrollTop(top: number) {
  //   this._scroll.setTop(top);
  // }

  // /**
  //  * The distance of the content's left to its leftmost visible content.
  //  *
  //  * @return {number}
  //  */
  // get scrollLeft(): number {
  //   return this._scroll.ev.scrollLeft;
  // }

  // /**
  //  * @param {number} top
  //  */
  // set scrollLeft(top: number) {
  //   this._scroll.setLeft(top);
  // }

  // /**
  //  * If the content is actively scrolling or not.
  //  *
  //  * @return {boolean}
  //  */
  // get isScrolling(): boolean {
  //   return this._scroll.isScrolling;
  // }

  // /**
  //  * The current, or last known, vertical scroll direction. Possible
  //  * string values include `down` and `up`.
  //  *
  //  * @return {string}
  //  */
  // get directionY(): string {
  //   return this._scroll.ev.directionY;
  // }

  // /**
  //  * The current, or last known, horizontal scroll direction. Possible
  //  * string values include `right` and `left`.
  //  *
  //  * @return {string}
  //  */
  // get directionX(): string {
  //   return this._scroll.ev.directionX;
  // }

  /**
   * @output {ScrollEvent} Emitted when the scrolling first starts.
   */
  @Prop() ionScrollStart: Function;

  /**
   * @output {ScrollEvent} Emitted on every scroll event.
   */
  @Prop() ionScroll: Function;

  /**
   * @output {ScrollEvent} Emitted when scrolling ends.
   */
  @Prop() ionScrollEnd: Function;


  constructor() {
    this.statusbarPadding = Ionic.config.getBoolean('statusbarPadding', false);
  }

  ionViewDidLoad() {
    this.$scroll = this.$el.shadowRoot.querySelector<any>('ion-scroll');
    this.$fixed = this.$el.querySelector<any>('ion-fixed');

    this.resize();
  }

  ionViewWillUnload() {
    this.$fixed = this.$scroll = this.$siblingFooter = this.$siblingHeader = this.$scrollDetail = null;
  }

  /**
   * Tell the content to recalculate its dimensions. This should be called
   * after dynamically adding/removing headers, footers, or tabs.
   */
  resize() {
    Ionic.dom.read(this.readDimensions.bind(this));
    Ionic.dom.write(this.writeDimensions.bind(this));
  }

  enableJsScroll() {
    this.$scroll.jsScroll = true;
  }

  // /**
  //  * Scroll to the specified position.
  //  *
  //  * @param {number} x  The x-value to scroll to.
  //  * @param {number} y  The y-value to scroll to.
  //  * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
  //  * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
  //  */
  // scrollTo(x: number, y: number, duration: number = 300, done?: Function): Promise<any> {
  //   console.debug(`content, scrollTo started, y: ${y}, duration: ${duration}`);
  //   return this._scroll.scrollTo(x, y, duration, done);
  // }

  /**
   * Scroll to the top of the content component.
   *
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollToTop(duration: number = 300) {
    return this.$scroll.scrollToTop(duration);
  }

  /**
   * Scroll to the bottom of the content component.
   *
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollToBottom(duration: number = 300) {
    return this.$scroll.scrollToBottom(duration);
  }

  /**
   * @input {boolean} If true, the content will scroll behind the headers
   * and footers. This effect can easily be seen by setting the toolbar
   * to transparent.
   */
  @Prop() fullscreen: boolean = false;

  // /**
  //  * @input {boolean} If true, the content will scroll down on load.
  //  */
  // @Input()
  // get scrollDownOnLoad(): boolean {
  //   return this._scrollDownOnLoad;
  // }

  // set scrollDownOnLoad(val: boolean) {
  //   this._scrollDownOnLoad = isTrueProperty(val);
  // }

  // /**
  //  * @hidden
  //  * DOM WRITE
  //  */
  // setScrollElementStyle(prop: string, val: any) {
  //   const scrollEle = this.getScrollElement();
  //   if (scrollEle) {
  //     this._dom.write(() => {
  //       (<any>scrollEle.style)[prop] = val;
  //     });
  //   }
  // }

  // /**
  //  * Returns the content and scroll elements' dimensions.
  //  * @returns {object} dimensions  The content and scroll elements' dimensions
  //  * {number} dimensions.contentHeight  content offsetHeight
  //  * {number} dimensions.contentTop  content offsetTop
  //  * {number} dimensions.contentBottom  content offsetTop+offsetHeight
  //  * {number} dimensions.contentWidth  content offsetWidth
  //  * {number} dimensions.contentLeft  content offsetLeft
  //  * {number} dimensions.contentRight  content offsetLeft + offsetWidth
  //  * {number} dimensions.scrollHeight  scroll scrollHeight
  //  * {number} dimensions.scrollTop  scroll scrollTop
  //  * {number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
  //  * {number} dimensions.scrollWidth  scroll scrollWidth
  //  * {number} dimensions.scrollLeft  scroll scrollLeft
  //  * {number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
  //  */
  // getContentDimensions(): ContentDimensions {
  //   const scrollEle = this.getScrollElement();
  //   const parentElement = scrollEle.parentElement;

  //   return {
  //     contentHeight: parentElement.offsetHeight - this._cTop - this._cBottom,
  //     contentTop: this._cTop,
  //     contentBottom: this._cBottom,

  //     contentWidth: parentElement.offsetWidth,
  //     contentLeft: parentElement.offsetLeft,

  //     scrollHeight: scrollEle.scrollHeight,
  //     scrollTop: scrollEle.scrollTop,

  //     scrollWidth: scrollEle.scrollWidth,
  //     scrollLeft: scrollEle.scrollLeft,
  //   };
  // }

  // /**
  //  * @hidden
  //  * DOM WRITE
  //  * Adds padding to the bottom of the scroll element when the keyboard is open
  //  * so content below the keyboard can be scrolled into view.
  //  */
  // addScrollPadding(newPadding: number) {
  //   if (newPadding > this._scrollPadding) {
  //     console.debug(`content, addScrollPadding, newPadding: ${newPadding}, this._scrollPadding: ${this._scrollPadding}`);

  //     this._scrollPadding = newPadding;
  //     var scrollEle = this.getScrollElement();
  //     if (scrollEle) {
  //       this._dom.write(() => {
  //         scrollEle.style.paddingBottom = (newPadding > 0) ? newPadding + 'px' : '';
  //       });
  //     }
  //   }
  // }

  // /**
  //  * @hidden
  //  * DOM WRITE
  //  */
  // clearScrollPaddingFocusOut() {
  //   if (!this._inputPolling) {
  //     console.debug(`content, clearScrollPaddingFocusOut begin`);
  //     this._inputPolling = true;

  //     this._keyboard.onClose(() => {
  //       console.debug(`content, clearScrollPaddingFocusOut _keyboard.onClose`);
  //       this._inputPolling = false;
  //       this._scrollPadding = -1;
  //       this.addScrollPadding(0);
  //     }, 200, 3000);
  //   }
  // }

  /**
   * @hidden
   * DOM READ
   */
  private readDimensions() {
    const cachePaddingTop = this._pTop;
    const cachePaddingRight = this._pRight;
    const cachePaddingBottom = this._pBottom;
    const cachePaddingLeft = this._pLeft;
    const cacheHeaderHeight = this._hdrHeight;
    const cacheFooterHeight = this._ftrHeight;
    const cacheTabsPlacement = this._tabsPlacement;
    let tabsTop = 0;
    this._pTop = 0;
    this._pRight = 0;
    this._pBottom = 0;
    this._pLeft = 0;
    this._hdrHeight = 0;
    this._ftrHeight = 0;
    this._tabsPlacement = null;
    this._tTop = 0;
    this._fTop = 0;
    this._fBottom = 0;
    let scrollDetail = this.$scrollDetail;

    let ele: HTMLElement = this.$el;

    let computedStyle: any;
    let tagName: string;
    let parentEle: HTMLElement = ele.parentElement;
    let children = parentEle.children;
    for (var i = children.length - 1; i >= 0; i--) {
      ele = <HTMLElement>children[i];
      tagName = ele.tagName;
      if (tagName === 'ION-CONTENT') {
        scrollDetail.contentElement = ele;

        if (this.fullscreen) {
          // ******** DOM READ ****************
          computedStyle = getComputedStyle(ele);
          this._pTop = parsePxUnit(computedStyle.paddingTop);
          this._pBottom = parsePxUnit(computedStyle.paddingBottom);
          this._pRight = parsePxUnit(computedStyle.paddingRight);
          this._pLeft = parsePxUnit(computedStyle.paddingLeft);
        }

      } else if (tagName === 'ION-HEADER') {
        scrollDetail.headerElement = ele;

        // ******** DOM READ ****************
        this._hdrHeight = ele.clientHeight;

      } else if (tagName === 'ION-FOOTER') {
        scrollDetail.footerElement = ele;

        // ******** DOM READ ****************
        this._ftrHeight = ele.clientHeight;
        this.$siblingFooter = ele;
      }
    }

    ele = parentEle;
    let tabbarEle: HTMLElement;

    while (ele && ele.tagName !== 'ION-MODAL' && !ele.classList.contains('tab-subpage')) {

      if (ele.tagName === 'ION-TABS') {
        tabbarEle = <HTMLElement>ele.firstElementChild;
        // ******** DOM READ ****************
        this._tabbarHeight = tabbarEle.clientHeight;

        if (this._tabsPlacement === null) {
          // this is the first tabbar found, remember it's position
          this._tabsPlacement = ele.getAttribute('tabsplacement');
        }
      }

      ele = ele.parentElement;
    }

    // Tabs top
    if (this._tabs && this._tabsPlacement === 'top') {
      this._tTop = this._hdrHeight;
      tabsTop = this._tabs._top;
    }

    // Toolbar height
    this._cTop = this._hdrHeight;
    this._cBottom = this._ftrHeight;

    // Tabs height
    if (this._tabsPlacement === 'top') {
      this._cTop += this._tabbarHeight;

    } else if (this._tabsPlacement === 'bottom') {
      this._cBottom += this._tabbarHeight;
    }

    // Fixed content shouldn't include content padding
    this._fTop = this._cTop;
    this._fBottom = this._cBottom;

    // Handle fullscreen viewport (padding vs margin)
    if (this.fullscreen) {
      this._cTop += this._pTop;
      this._cBottom += this._pBottom;
    }

    // ******** DOM READ ****************
    const contentDimensions = this.getContentDimensions();
    scrollDetail.scrollHeight = contentDimensions.scrollHeight;
    scrollDetail.scrollWidth = contentDimensions.scrollWidth;
    scrollDetail.contentHeight = contentDimensions.contentHeight;
    scrollDetail.contentWidth = contentDimensions.contentWidth;
    scrollDetail.contentTop = contentDimensions.contentTop;
    scrollDetail.contentBottom = contentDimensions.contentBottom;

    this._dirty = (
      cachePaddingTop !== this._pTop ||
      cachePaddingBottom !== this._pBottom ||
      cachePaddingLeft !== this._pLeft ||
      cachePaddingRight !== this._pRight ||
      cacheHeaderHeight !== this._hdrHeight ||
      cacheFooterHeight !== this._ftrHeight ||
      cacheTabsPlacement !== this._tabsPlacement ||
      tabsTop !== this._tTop ||
      this._cTop !== this.contentTop ||
      this._cBottom !== this.contentBottom
    );
  }

  /**
   * @hidden
   * DOM WRITE
   */
  private writeDimensions() {
    if (!this._dirty) {
      return;
    }

    // Tabs height
    if (this._tabsPlacement === 'bottom' && this._cBottom > 0 && this.$siblingFooter) {
      var footerPos = this._cBottom - this._ftrHeight;

      // ******** DOM WRITE ****************
      this.$siblingFooter.style.bottom = cssFormat(footerPos);
    }

    // Handle fullscreen viewport (padding vs margin)
    let topProperty = 'marginTop';
    let bottomProperty = 'marginBottom';
    // let fixedTop: number = this._fTop;
    // let fixedBottom: number = this._fBottom;

    if (this.fullscreen) {
      // adjust the content with padding, allowing content to scroll under headers/footers
      // however, on iOS you cannot control the margins of the scrollbar (last tested iOS9.2)
      // only add inline padding styles if the computed padding value, which would
      // have come from the app's css, is different than the new padding value
      topProperty = 'paddingTop';
      bottomProperty = 'paddingBottom';
    }

    // Only update top margin if value changed
    if (this._cTop !== this.contentTop) {
      // ******** DOM WRITE ****************
      (<any>this.$scroll).style[topProperty] = cssFormat(this._cTop);

      // ******** DOM WRITE ****************
      // this.$fixed.style.marginTop = cssFormat(fixedTop);

      this.contentTop = this._cTop;
    }

    // Only update bottom margin if value changed
    if (this._cBottom !== this.contentBottom) {
      // ******** DOM WRITE ****************
      (<any>this.$scroll).style[bottomProperty] = cssFormat(this._cBottom);

      // ******** DOM WRITE ****************
      // fixedEle.style.marginBottom = cssFormat(fixedBottom);

      this.contentBottom = this._cBottom;
    }

    if (this._tabsPlacement !== null && this._tabs) {
      // set the position of the tabbar
      if (this._tabsPlacement === 'top') {
        // ******** DOM WRITE ****************
        this._tabs.setTabbarPosition(this._tTop, -1);

      } else {
        // ******** DOM WRITE ****************
        this._tabs.setTabbarPosition(-1, 0);
      }
    }

    // Scroll the page all the way down after setting dimensions
    if (this._scrollDownOnLoad) {
      this.scrollToBottom(0);
      this._scrollDownOnLoad = false;
    }
  }

  /**
   * Returns the content and scroll elements' dimensions.
   * @returns {object} dimensions  The content and scroll elements' dimensions
   * {number} dimensions.contentHeight  content offsetHeight
   * {number} dimensions.contentTop  content offsetTop
   * {number} dimensions.contentBottom  content offsetTop+offsetHeight
   * {number} dimensions.contentWidth  content offsetWidth
   * {number} dimensions.contentLeft  content offsetLeft
   * {number} dimensions.contentRight  content offsetLeft + offsetWidth
   * {number} dimensions.scrollHeight  scroll scrollHeight
   * {number} dimensions.scrollTop  scroll scrollTop
   * {number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
   * {number} dimensions.scrollWidth  scroll scrollWidth
   * {number} dimensions.scrollLeft  scroll scrollLeft
   * {number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
   */
  getContentDimensions(): ContentDimensions {
    const scrollElm: HTMLElement = <any>this.$scroll;
    const contentElm = this.$el;

    return {
      contentHeight: contentElm.offsetHeight - this._cTop - this._cBottom,
      contentTop: this._cTop,
      contentBottom: this._cBottom,

      contentWidth: contentElm.offsetWidth,
      contentLeft: contentElm.offsetLeft,

      scrollHeight: scrollElm.scrollHeight,
      scrollTop: scrollElm.scrollTop,

      scrollWidth: scrollElm.scrollWidth,
      scrollLeft: scrollElm.scrollLeft,
    };
  }


  render() {
    const props: any = {};

    if (this.ionScrollStart) {
      props['ionScrollStart'] = this.ionScrollStart.bind(this);
    }
    if (this.ionScroll) {
      props['ionScroll'] = this.ionScroll.bind(this);
    }
    if (this.ionScrollEnd) {
      props['ionScrollEnd'] = this.ionScrollEnd.bind(this);
    }

    return h(this,
      h('ion-scroll', Ionic.theme(this, 'content', {
          class: {
            'scroll-content': true,
            'statusbar-padding': this.statusbarPadding,
          },
          props: props
        }),
        h('slot')
      )
    );
  }

}

function parsePxUnit(val: string): number {
  return (val.indexOf('px') > 0) ? parseInt(val, 10) : 0;
}

function cssFormat(val: number): string {
  return (val > 0 ? val + 'px' : '');
}
