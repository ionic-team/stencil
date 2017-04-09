import { Component, ComponentFactoryResolver, ElementRef, forwardRef, Input, Optional, NgZone, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../platform/keyboard';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
import { ViewController } from '../../navigation/view-controller';
import { RootNode } from '../split-pane/split-pane';
/**
 * \@name Nav
 * \@description
 *
 * `ion-nav` is the declarative component for a [NavController](../../../navigation/NavController/).
 *
 * For more information on using nav controllers like Nav or [Tab](../../Tabs/Tab/),
 * take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 *
 * \@usage
 * You must set a root page to be loaded initially by any Nav you create, using
 * the 'root' property:
 *
 * ```ts
 * import { Component } from '\@angular/core';
 * import { GettingStartedPage } from './getting-started';
 *
 * \@Component({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 * })
 * class MyApp {
 *   root = GettingStartedPage;
 *
 *   constructor(){
 *   }
 * }
 * ```
 *
 * \@demo /docs/demos/src/navigation/
 * @see {\@link /docs/components#navigation Navigation Component Docs}
 */
export class Nav extends NavControllerBase {
    /**
     * @param {?} viewCtrl
     * @param {?} parent
     * @param {?} app
     * @param {?} config
     * @param {?} plt
     * @param {?} keyboard
     * @param {?} elementRef
     * @param {?} zone
     * @param {?} renderer
     * @param {?} cfr
     * @param {?} gestureCtrl
     * @param {?} transCtrl
     * @param {?} linker
     * @param {?} domCtrl
     */
    constructor(viewCtrl, parent, app, config, plt, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl) {
        super(parent, app, config, plt, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl);
        this._hasInit = false;
        if (viewCtrl) {
            // an ion-nav can also act as an ion-page within a parent ion-nav
            // this would happen when an ion-nav nests a child ion-nav.
            viewCtrl._setContent(this);
        }
        if (parent) {
            // this Nav has a parent Nav
            parent.registerChildNav(this);
        }
        else if (viewCtrl && viewCtrl.getNav()) {
            // this Nav was opened from a modal
            this.parent = viewCtrl.getNav();
            this.parent.registerChildNav(this);
        }
        else if (app && !app.getRootNav()) {
            // a root nav has not been registered yet with the app
            // this is the root navcontroller for the entire app
            app._setRootNav(this);
        }
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    set _vp(val) {
        this.setViewport(val);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this._hasInit = true;
        let /** @type {?} */ navSegment = this._linker.initNav(this);
        if (navSegment && (navSegment.component || navSegment.loadChildren)) {
            // there is a segment match in the linker
            return this._linker.initViews(navSegment).then(views => {
                this.setPages(views, null, null);
            });
        }
        else if (this._root) {
            // no segment match, so use the root property
            return this.push(this._root, this.rootParams, {
                isNavRoot: ((this._app.getRootNav()) === this)
            }, null);
        }
    }
    /**
     * @param {?} opts
     * @return {?}
     */
    goToRoot(opts) {
        this.setRoot(this._root, this.rootParams, opts, null);
    }
    /**
     * \@input {Page} The Page component to load as the root page within this nav.
     * @return {?}
     */
    get root() {
        return this._root;
    }
    /**
     * @param {?} page
     * @return {?}
     */
    set root(page) {
        this._root = page;
        if (this._hasInit) {
            this.setRoot(page);
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        this.destroy();
    }
    /**
     * @return {?}
     */
    initPane() {
        const /** @type {?} */ isMain = this._elementRef.nativeElement.hasAttribute('main');
        return isMain;
    }
    /**
     * @param {?} isPane
     * @return {?}
     */
    paneChanged(isPane) {
        if (isPane) {
            this.resize();
        }
    }
}
Nav.decorators = [
    { type: Component, args: [{
                selector: 'ion-nav',
                template: '<div #viewport nav-viewport></div>' +
                    '<div class="nav-decor"></div>',
                encapsulation: ViewEncapsulation.None,
                providers: [{ provide: RootNode, useExisting: forwardRef(() => Nav) }]
            },] },
];
/**
 * @nocollapse
 */
Nav.ctorParameters = () => [
    { type: ViewController, decorators: [{ type: Optional },] },
    { type: NavController, decorators: [{ type: Optional },] },
    { type: App, },
    { type: Config, },
    { type: Platform, },
    { type: Keyboard, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: Renderer, },
    { type: ComponentFactoryResolver, },
    { type: GestureController, },
    { type: TransitionController, },
    { type: DeepLinker, decorators: [{ type: Optional },] },
    { type: DomController, },
];
Nav.propDecorators = {
    '_vp': [{ type: ViewChild, args: ['viewport', { read: ViewContainerRef },] },],
    'root': [{ type: Input },],
    'rootParams': [{ type: Input },],
};
function Nav_tsickle_Closure_declarations() {
    /** @type {?} */
    Nav.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Nav.ctorParameters;
    /** @type {?} */
    Nav.propDecorators;
    /** @type {?} */
    Nav.prototype._root;
    /** @type {?} */
    Nav.prototype._hasInit;
    /**
     * \@input {object} Any nav-params to pass to the root page of this nav.
     * @type {?}
     */
    Nav.prototype.rootParams;
}
//# sourceMappingURL=nav.js.map