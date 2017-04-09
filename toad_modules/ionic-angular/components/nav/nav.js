var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Nav = (function (_super) {
    __extends(Nav, _super);
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
    function Nav(viewCtrl, parent, app, config, plt, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl) {
        var _this = _super.call(this, parent, app, config, plt, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl) || this;
        _this._hasInit = false;
        if (viewCtrl) {
            // an ion-nav can also act as an ion-page within a parent ion-nav
            // this would happen when an ion-nav nests a child ion-nav.
            viewCtrl._setContent(_this);
        }
        if (parent) {
            // this Nav has a parent Nav
            parent.registerChildNav(_this);
        }
        else if (viewCtrl && viewCtrl.getNav()) {
            // this Nav was opened from a modal
            _this.parent = viewCtrl.getNav();
            _this.parent.registerChildNav(_this);
        }
        else if (app && !app.getRootNav()) {
            // a root nav has not been registered yet with the app
            // this is the root navcontroller for the entire app
            app._setRootNav(_this);
        }
        return _this;
    }
    Object.defineProperty(Nav.prototype, "_vp", {
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this.setViewport(val);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Nav.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._hasInit = true;
        var /** @type {?} */ navSegment = this._linker.initNav(this);
        if (navSegment && (navSegment.component || navSegment.loadChildren)) {
            // there is a segment match in the linker
            return this._linker.initViews(navSegment).then(function (views) {
                _this.setPages(views, null, null);
            });
        }
        else if (this._root) {
            // no segment match, so use the root property
            return this.push(this._root, this.rootParams, {
                isNavRoot: ((this._app.getRootNav()) === this)
            }, null);
        }
    };
    /**
     * @param {?} opts
     * @return {?}
     */
    Nav.prototype.goToRoot = function (opts) {
        this.setRoot(this._root, this.rootParams, opts, null);
    };
    Object.defineProperty(Nav.prototype, "root", {
        /**
         * \@input {Page} The Page component to load as the root page within this nav.
         * @return {?}
         */
        get: function () {
            return this._root;
        },
        /**
         * @param {?} page
         * @return {?}
         */
        set: function (page) {
            this._root = page;
            if (this._hasInit) {
                this.setRoot(page);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * @return {?}
     */
    Nav.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    /**
     * @return {?}
     */
    Nav.prototype.initPane = function () {
        var /** @type {?} */ isMain = this._elementRef.nativeElement.hasAttribute('main');
        return isMain;
    };
    /**
     * @param {?} isPane
     * @return {?}
     */
    Nav.prototype.paneChanged = function (isPane) {
        if (isPane) {
            this.resize();
        }
    };
    return Nav;
}(NavControllerBase));
export { Nav };
Nav.decorators = [
    { type: Component, args: [{
                selector: 'ion-nav',
                template: '<div #viewport nav-viewport></div>' +
                    '<div class="nav-decor"></div>',
                encapsulation: ViewEncapsulation.None,
                providers: [{ provide: RootNode, useExisting: forwardRef(function () { return Nav; }) }]
            },] },
];
/**
 * @nocollapse
 */
Nav.ctorParameters = function () { return [
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
]; };
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