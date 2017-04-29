import { Component, h, Ionic } from '../index';
// import { Menu as MenuInterface, MenuType } from './menu-interface';


@Component({
  tag: 'ion-menu',
  loadOnIdle: true
})
export class Menu {

  render() {
    // '<div class="menu-inner"><ng-content></ng-content></div>' +
    // '<ion-backdrop></ion-backdrop>',

    return h(this,
      h('ion-gesture.menu-inner', Ionic.theme(this, 'menu', {
        props: {
          // 'canStart': this.canStart.bind(this),
          // 'onStart': this.onDragStart.bind(this),
          // 'onMove': this.onDragMove.bind(this),
          // 'onEnd': this.onDragEnd.bind(this),
          // 'onPress': this.toggle.bind(this),
          'gestureName': 'menu',
          'gesturePriority': 30,
          'type': 'pan,press',
          'direction': 'x',
          'threshold': 20,
          'listenOn': 'parent'
        },
        attrs: {
          'role': 'navigation'
        }
      }),
        h('slot')
      )
    );
  }

  // private _cntEle: HTMLElement;
  // private _gesture: MenuContentGesture;
  // private _type: MenuType;
  // private _isEnabled: boolean;
  // private _isSwipeEnabled: boolean = true;
  // private _isAnimating: boolean = false;
  // private _isPersistent: boolean = false;
  // private _init: boolean = false;
  // private _events: UIEventManager;
  // private _gestureBlocker: BlockerDelegate;
  // private _isPane: boolean = false;
  // private _side: Side;

  // /**
  //  * @hidden
  //  */
  // isOpen: boolean = false;

  // /**
  //  * @hidden
  //  */
  // isRightSide: boolean = false;

  // /**
  //  * @hidden
  //  */
  // @ViewChild(Backdrop) backdrop: Backdrop;

  // /**
  //  * @hidden
  //  */
  // @ContentChild(Content) menuContent: Content;

  // /**
  //  * @hidden
  //  */
  // @ContentChild(Nav) menuNav: Nav;

  // /**
  //  * @input {any} A reference to the content element the menu should use.
  //  */
  // @Input() content: any;

  // /**
  //  * @input {string} An id for the menu.
  //  */
  // @Input() id: string;

  // /**
  //  * @input {string} The display type of the menu. Default varies based on the mode,
  //  * see the `menuType` in the [config](../../config/Config). Available options:
  //  * `"overlay"`, `"reveal"`, `"push"`.
  //  */
  // @Input() type: string;

  // /**
  //  * @input {boolean} If true, the menu is enabled. Default `true`.
  //  */
  // @Input()
  // get enabled(): boolean {
  //   return this._isEnabled;
  // }

  // set enabled(val: boolean) {
  //   const isEnabled = isTrueProperty(val);
  //   this.enable(isEnabled);
  // }

  // /**
  //  * @input {string} Which side of the view the menu should be placed. Default `"left"`.
  //  */
  // @Input()
  // get side(): Side {
  //   return this._side;
  // }

  // set side(val: Side) {
  //   this.isRightSide = isRightSide(val, this._plt.isRTL);
  //   if (this.isRightSide) {
  //     this._side = 'right';
  //   } else {
  //     this._side = 'left';
  //   }
  // }

  // /**
  //  * @input {boolean} If true, swiping the menu is enabled. Default `true`.
  //  */
  // @Input()
  // get swipeEnabled(): boolean {
  //   return this._isSwipeEnabled;
  // }

  // set swipeEnabled(val: boolean) {
  //   const isEnabled = isTrueProperty(val);
  //   this.swipeEnable(isEnabled);
  // }

  // /**
  //  * @input {boolean} If true, the menu will persist on child pages.
  //  */
  // @Input()
  // get persistent(): boolean {
  //   return this._isPersistent;
  // }

  // set persistent(val: boolean) {
  //   this._isPersistent = isTrueProperty(val);
  // }

  // /**
  //  * @hidden
  //  */
  // @Input() maxEdgeStart: number;

  // /**
  //  * @output {event} Emitted when the menu is being dragged open.
  //  */
  // @Output() ionDrag: EventEmitter<number> = new EventEmitter<number>();

  // /**
  //  * @output {event} Emitted when the menu has been opened.
  //  */
  // @Output() ionOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  // /**
  //  * @output {event} Emitted when the menu has been closed.
  //  */
  // @Output() ionClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  // constructor(
  //   public _menuCtrl: MenuController,
  //   private _elementRef: ElementRef,
  //   private _config: Config,
  //   private _plt: Platform,
  //   private _renderer: Renderer,
  //   private _keyboard: Keyboard,
  //   private _zone: NgZone,
  //   private _gestureCtrl: GestureController,
  //   private _domCtrl: DomController,
  //   private _app: App,
  // ) {
  //   this._events = new UIEventManager(_plt);
  //   this._gestureBlocker = _gestureCtrl.createBlocker({
  //     disable: [GESTURE_GO_BACK_SWIPE]
  //   });
  //   this.side = 'start';
  // }

  // /**
  //  * @hidden
  //  */
  // ngOnInit() {
  //   this._init = true;

  //   let content = this.content;
  //   this._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();

  //   // requires content element
  //   if (!this._cntEle) {
  //     return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
  //   }

  //   this.setElementAttribute('side', this._side);

  //   // normalize the "type"
  //   if (!this.type) {
  //     this.type = this._config.get('menuType');
  //   }
  //   this.setElementAttribute('type', this.type);

  //   // add the gestures
  //   this._gesture = new MenuContentGesture(this._plt, this, this._gestureCtrl, this._domCtrl);

  //   // add menu's content classes
  //   this._cntEle.classList.add('menu-content');
  //   this._cntEle.classList.add('menu-content-' + this.type);

  //   let isEnabled = this._isEnabled;
  //   if (isEnabled === true || typeof isEnabled === 'undefined') {
  //     // check if more than one menu is on the same side
  //     isEnabled = !this._menuCtrl.getMenus().some(m => {
  //       return m.side === this.side && m.enabled;
  //     });
  //   }
  //   // register this menu with the app's menu controller
  //   this._menuCtrl._register(this);

  //   // mask it as enabled / disabled
  //   this.enable(isEnabled);
  // }

  // /**
  //  * @hidden
  //  */
  // onBackdropClick(ev: UIEvent) {
  //   ev.preventDefault();
  //   ev.stopPropagation();
  //   this._menuCtrl.close();
  // }

  // /**
  //  * @hidden
  //  */
  // private _getType(): MenuType {
  //   if (!this._type) {
  //     this._type = MenuController.create(this.type, this, this._plt);

  //     if (this._config.get('animate') === false) {
  //       this._type.ani.duration(0);
  //     }
  //   }
  //   return this._type;
  // }

  // /**
  //  * @hidden
  //  */
  // setOpen(shouldOpen: boolean, animated: boolean = true): Promise<boolean> {
  //   // If the menu is disabled or it is currenly being animated, let's do nothing
  //   if ((shouldOpen === this.isOpen) || !this._canOpen() || this._isAnimating) {
  //     return Promise.resolve(this.isOpen);
  //   }
  //   return new Promise(resolve => {
  //     this._before();
  //     this._getType().setOpen(shouldOpen, animated, () => {
  //       this._after(shouldOpen);
  //       resolve(this.isOpen);
  //     });
  //   });
  // }

  // _forceClosing() {
  //   assert(this.isOpen, 'menu cannot be closed');
  //   this._isAnimating = true;
  //   this._getType().setOpen(false, false, () => {
  //     this._after(false);
  //   });
  // }

  // /**
  //  * @hidden
  //  */
  // canSwipe(): boolean {
  //   return this._isSwipeEnabled &&
  //     !this._isAnimating &&
  //     this._canOpen() &&
  //     this._app.isEnabled();
  // }

  // /**
  //  * @hidden
  //  */
  // isAnimating(): boolean {
  //   return this._isAnimating;
  // }


  // _swipeBeforeStart() {
  //   if (!this.canSwipe()) {
  //     assert(false, 'canSwipe() has to be true');
  //     return;
  //   }
  //   this._before();
  // }

  // _swipeStart() {
  //   if (!this._isAnimating) {
  //     assert(false, '_isAnimating has to be true');
  //     return;
  //   }

  //   this._getType().setProgressStart(this.isOpen);
  // }

  // _swipeProgress(stepValue: number) {
  //   if (!this._isAnimating) {
  //     assert(false, '_isAnimating has to be true');
  //     return;
  //   }

  //   this._getType().setProgessStep(stepValue);
  //   const ionDrag = this.ionDrag;
  //   if (ionDrag.observers.length > 0) {
  //     ionDrag.emit(stepValue);
  //   }
  // }

  // _swipeEnd(shouldCompleteLeft: boolean, shouldCompleteRight: boolean, stepValue: number, velocity: number) {
  //   if (!this._isAnimating) {
  //     assert(false, '_isAnimating has to be true');
  //     return;
  //   }

  //   // user has finished dragging the menu
  //   const isRightSide = this.isRightSide;
  //   const opening = !this.isOpen;
  //   const shouldComplete = (opening)
  //   ? isRightSide ? shouldCompleteLeft : shouldCompleteRight
  //   : isRightSide ? shouldCompleteRight : shouldCompleteLeft;

  //   this._getType().setProgressEnd(shouldComplete, stepValue, velocity, (isOpen: boolean) => {
  //     console.debug('menu, swipeEnd', this.side);
  //     this._after(isOpen);
  //   });
  // }

  // private _before() {
  //   assert(!this._isAnimating, '_before() should not be called while animating');

  //   // this places the menu into the correct location before it animates in
  //   // this css class doesn't actually kick off any animations
  //   this.setElementClass('show-menu', true);
  //   this.backdrop.setElementClass('show-backdrop', true);
  //   this.resize();
  //   this._keyboard.close();
  //   this._isAnimating = true;
  // }

  // private _after(isOpen: boolean) {
  //   assert(this._isAnimating, '_before() should be called while animating');

  //   this._app.setEnabled(false, 100);
  //   // keep opening/closing the menu disabled for a touch more yet
  //   // only add listeners/css if it's enabled and isOpen
  //   // and only remove listeners/css if it's not open
  //   // emit opened/closed events
  //   this.isOpen = isOpen;
  //   this._isAnimating = false;

  //   this._events.unlistenAll();
  //   if (isOpen) {
  //     // Disable swipe to go back gesture
  //     this._gestureBlocker.block();

  //     this._cntEle.classList.add('menu-content-open');
  //     let callback = this.onBackdropClick.bind(this);
  //     this._events.listen(this._cntEle, 'click', callback, { capture: true });
  //     this._events.listen(this.backdrop.getNativeElement(), 'click', callback, { capture: true });

  //     this.ionOpen.emit(true);

  //   } else {
  //     // Enable swipe to go back gesture
  //     this._gestureBlocker.unblock();

  //     this._cntEle.classList.remove('menu-content-open');
  //     this.setElementClass('show-menu', false);
  //     this.backdrop.setElementClass('show-menu', false);

  //     this.ionClose.emit(true);
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // open(): Promise<boolean> {
  //   return this.setOpen(true);
  // }

  // /**
  //  * @hidden
  //  */
  // close(): Promise<boolean> {
  //   return this.setOpen(false);
  // }

  // /**
  //  * @hidden
  //  */
  // resize() {
  //   const content: Content | Nav = this.menuContent
  //     ? this.menuContent
  //     : this.menuNav;
  //   content && content.resize();
  // }

  // /**
  //  * @hidden
  //  */
  // toggle(): Promise<boolean> {
  //   return this.setOpen(!this.isOpen);
  // }

  // _canOpen(): boolean {
  //   return this._isEnabled && !this._isPane;
  // }

  // /**
  //  * @hidden
  //  */
  // _updateState() {
  //   const canOpen = this._canOpen();

  //   // Close menu inmediately
  //   if (!canOpen && this.isOpen) {
  //     assert(this._init, 'menu must be initialized');
  //     // close if this menu is open, and should not be enabled
  //     this._forceClosing();
  //   }

  //   if (this._isEnabled && this._menuCtrl) {
  //     this._menuCtrl._setActiveMenu(this);
  //   }

  //   if (!this._init) {
  //     return;
  //   }

  //   const gesture = this._gesture;
  //   // only listen/unlisten if the menu has initialized
  //   if (canOpen && this._isSwipeEnabled && !gesture.isListening) {
  //     // should listen, but is not currently listening
  //     console.debug('menu, gesture listen', this.side);
  //     gesture.listen();

  //   } else if (gesture.isListening && (!canOpen || !this._isSwipeEnabled)) {
  //     // should not listen, but is currently listening
  //     console.debug('menu, gesture unlisten', this.side);
  //     gesture.unlisten();
  //   }

  //   if (this.isOpen || (this._isPane && this._isEnabled)) {
  //     this.resize();
  //   }
  //   assert(!this._isAnimating, 'can not be animating');
  // }

  // /**
  //  * @hidden
  //  */
  // enable(shouldEnable: boolean): Menu {
  //   this._isEnabled = shouldEnable;
  //   this.setElementClass('menu-enabled', shouldEnable);
  //   this._updateState();
  //   return this;
  // }

  // /**
  //  * @internal
  //  */
  // initPane(): boolean {
  //   return false;
  // }

  // /**
  //  * @internal
  //  */
  // paneChanged(isPane: boolean) {
  //   this._isPane = isPane;
  //   this._updateState();
  // }

  // /**
  //  * @hidden
  //  */
  // swipeEnable(shouldEnable: boolean): Menu {
  //   this._isSwipeEnabled = shouldEnable;
  //   this._updateState();
  //   return this;
  // }

  // /**
  //  * @hidden
  //  */
  // getNativeElement(): HTMLElement {
  //   return this._elementRef.nativeElement;
  // }

  // /**
  //  * @hidden
  //  */
  // getMenuElement(): HTMLElement {
  //   return <HTMLElement>this.getNativeElement().querySelector('.menu-inner');
  // }

  // /**
  //  * @hidden
  //  */
  // getContentElement(): HTMLElement {
  //   return this._cntEle;
  // }

  // /**
  //  * @hidden
  //  */
  // getBackdropElement(): HTMLElement {
  //   return this.backdrop.getNativeElement();
  // }

  // /**
  //  * @hidden
  //  */
  // width(): number {
  //   return this.getMenuElement().offsetWidth;
  // }

  // /**
  //  * @hidden
  //  */
  // getMenuController(): MenuController {
  //   return this._menuCtrl;
  // }

  // /**
  //  * @hidden
  //  */
  // setElementClass(className: string, add: boolean) {
  //   this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  // }

  // /**
  //  * @hidden
  //  */
  // setElementAttribute(attributeName: string, value: string) {
  //   this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, value);
  // }

  // /**
  //  * @hidden
  //  */
  // getElementRef(): ElementRef {
  //   return this._elementRef;
  // }

  // /**
  //  * @hidden
  //  */
  // ngOnDestroy() {
  //   this._menuCtrl._unregister(this);
  //   this._events.destroy();
  //   this._gesture && this._gesture.destroy();
  //   this._type && this._type.destroy();

  //   this._gesture = null;
  //   this._type = null;
  //   this._cntEle = null;
  // }

}
