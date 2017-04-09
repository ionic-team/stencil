(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/platform-browser", "./app-constants", "../../config/config", "../../navigation/nav-util", "../menu/menu-controller", "../../platform/platform", "../../transitions/transition-ios", "../../transitions/transition-md", "../../transitions/transition-wp"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var platform_browser_1 = require("@angular/platform-browser");
    var Constants = require("./app-constants");
    var config_1 = require("../../config/config");
    var nav_util_1 = require("../../navigation/nav-util");
    var menu_controller_1 = require("../menu/menu-controller");
    var platform_1 = require("../../platform/platform");
    var transition_ios_1 = require("../../transitions/transition-ios");
    var transition_md_1 = require("../../transitions/transition-md");
    var transition_wp_1 = require("../../transitions/transition-wp");
    /**
     * \@name App
     * \@description
     * App is a utility class used in Ionic to get information about various aspects of an app
     */
    var App = (function () {
        /**
         * @param {?} _config
         * @param {?} _plt
         * @param {?=} _menuCtrl
         */
        function App(_config, _plt, _menuCtrl) {
            this._config = _config;
            this._plt = _plt;
            this._menuCtrl = _menuCtrl;
            this._disTime = 0;
            this._scrollTime = 0;
            this._title = '';
            this._titleSrv = new platform_browser_1.Title(platform_browser_1.DOCUMENT);
            this._rootNav = null;
            /**
             * Observable that emits whenever a view loads in the app.
             */
            this.viewDidLoad = new core_1.EventEmitter();
            /**
             * Observable that emits before any view is entered in the app.
             */
            this.viewWillEnter = new core_1.EventEmitter();
            /**
             * Observable that emits after any view is entered in the app.
             */
            this.viewDidEnter = new core_1.EventEmitter();
            /**
             * Observable that emits before any view is exited in the app.
             */
            this.viewWillLeave = new core_1.EventEmitter();
            /**
             * Observable that emits after any view is exited in the app.
             */
            this.viewDidLeave = new core_1.EventEmitter();
            /**
             * Observable that emits before any view unloads in the app.
             */
            this.viewWillUnload = new core_1.EventEmitter();
            // listen for hardware back button events
            // register this back button action with a default priority
            _plt.registerBackButtonAction(this.goBack.bind(this));
            this._disableScrollAssist = _config.getBoolean('disableScrollAssist', false);
            (void 0) /* runInDev */;
            _config.setTransition('ios-transition', transition_ios_1.IOSTransition);
            _config.setTransition('md-transition', transition_md_1.MDTransition);
            _config.setTransition('wp-transition', transition_wp_1.WPTransition);
        }
        /**
         * Sets the document title.
         * @param {?} val
         * @return {?}
         */
        App.prototype.setTitle = function (val) {
            if (val !== this._title) {
                this._title = val;
                this._titleSrv.setTitle(val);
            }
        };
        /**
         * @hidden
         * @param {?} className
         * @param {?} isAdd
         * @return {?}
         */
        App.prototype.setElementClass = function (className, isAdd) {
            this._appRoot.setElementClass(className, isAdd);
        };
        /**
         * @hidden
         * Sets if the app is currently enabled or not, meaning if it's
         * available to accept new user commands. For example, this is set to `false`
         * while views transition, a modal slides up, an action-sheet
         * slides up, etc. After the transition completes it is set back to `true`.
         * is used to set the maximum number of milliseconds that app will wait until
         * it will automatically enable the app again. It's basically a fallback incase
         * something goes wrong during a transition and the app wasn't re-enabled correctly.
         * @param {?} isEnabled
         * @param {?=} duration
         * @param {?=} minDuration
         * @return {?}
         */
        App.prototype.setEnabled = function (isEnabled, duration, minDuration) {
            if (duration === void 0) { duration = 700; }
            if (minDuration === void 0) { minDuration = 0; }
            this._disTime = (isEnabled ? 0 : Date.now() + duration);
            if (this._clickBlock) {
                if (isEnabled) {
                    // disable the click block if it's enabled, or the duration is tiny
                    this._clickBlock.activate(false, CLICK_BLOCK_BUFFER_IN_MILLIS, minDuration);
                }
                else {
                    // show the click block for duration + some number
                    this._clickBlock.activate(true, duration + CLICK_BLOCK_BUFFER_IN_MILLIS, minDuration);
                }
            }
        };
        /**
         * @hidden
         * Toggles whether an application can be scrolled
         * scrolling is enabled. When set to `true`, scrolling is disabled.
         * @param {?} disableScroll
         * @return {?}
         */
        App.prototype._setDisableScroll = function (disableScroll) {
            if (this._disableScrollAssist) {
                this._appRoot._disableScroll(disableScroll);
            }
        };
        /**
         * @hidden
         * Boolean if the app is actively enabled or not.
         * @return {?}
         */
        App.prototype.isEnabled = function () {
            var /** @type {?} */ disTime = this._disTime;
            if (disTime === 0) {
                return true;
            }
            return (disTime < Date.now());
        };
        /**
         * @hidden
         * @return {?}
         */
        App.prototype.setScrolling = function () {
            this._scrollTime = Date.now() + ACTIVE_SCROLLING_TIME;
        };
        /**
         * Boolean if the app is actively scrolling or not.
         * @return {?}
         */
        App.prototype.isScrolling = function () {
            var /** @type {?} */ scrollTime = this._scrollTime;
            if (scrollTime === 0) {
                return false;
            }
            if (scrollTime < Date.now()) {
                this._scrollTime = 0;
                return false;
            }
            return true;
        };
        /**
         * @return {?}
         */
        App.prototype.getActiveNav = function () {
            var /** @type {?} */ portal = this._appRoot._getPortal(Constants.PORTAL_MODAL);
            if (portal.length() > 0) {
                return findTopNav(portal);
            }
            return findTopNav(this._rootNav || null);
        };
        /**
         * @return {?}
         */
        App.prototype.getRootNav = function () {
            return this._rootNav;
        };
        /**
         * @hidden
         * @param {?} nav
         * @return {?}
         */
        App.prototype._setRootNav = function (nav) {
            this._rootNav = nav;
        };
        /**
         * @hidden
         * @param {?} enteringView
         * @param {?} opts
         * @param {?=} appPortal
         * @return {?}
         */
        App.prototype.present = function (enteringView, opts, appPortal) {
            var /** @type {?} */ portal = this._appRoot._getPortal(appPortal);
            // Set Nav must be set here in order to dimiss() work synchnously.
            // TODO: move _setNav() to the earlier stages of NavController. _queueTrns()
            enteringView._setNav(portal);
            opts.keyboardClose = false;
            opts.direction = nav_util_1.DIRECTION_FORWARD;
            if (!opts.animation) {
                opts.animation = enteringView.getTransitionName(nav_util_1.DIRECTION_FORWARD);
            }
            enteringView.setLeavingOpts({
                keyboardClose: false,
                direction: nav_util_1.DIRECTION_BACK,
                animation: enteringView.getTransitionName(nav_util_1.DIRECTION_BACK),
                ev: opts.ev
            });
            return portal.insertPages(-1, [enteringView], opts);
        };
        /**
         * @hidden
         * @return {?}
         */
        App.prototype.goBack = function () {
            if (this._menuCtrl && this._menuCtrl.isOpen()) {
                return this._menuCtrl.close();
            }
            var /** @type {?} */ navPromise = this.navPop();
            if (navPromise === null) {
                // no views to go back to
                // let's exit the app
                if (this._config.getBoolean('navExitApp', true)) {
                    (void 0) /* console.debug */;
                    this._plt.exitApp();
                }
            }
            return navPromise;
        };
        /**
         * @hidden
         * @return {?}
         */
        App.prototype.navPop = function () {
            if (!this._rootNav || !this.isEnabled()) {
                return Promise.resolve();
            }
            // If there are any alert/actionsheet open, let's do nothing
            var /** @type {?} */ portal = this._appRoot._getPortal(Constants.PORTAL_DEFAULT);
            if (portal.length() > 0) {
                return Promise.resolve();
            }
            // next get the active nav, check itself and climb up all
            // of its parent navs until it finds a nav that can pop
            return recursivePop(this.getActiveNav());
        };
        return App;
    }());
    App.decorators = [
        { type: core_1.Injectable },
    ];
    /**
     * @nocollapse
     */
    App.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: menu_controller_1.MenuController, decorators: [{ type: core_1.Optional },] },
    ]; };
    exports.App = App;
    function App_tsickle_Closure_declarations() {
        /** @type {?} */
        App.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        App.ctorParameters;
        /** @type {?} */
        App.prototype._disTime;
        /** @type {?} */
        App.prototype._scrollTime;
        /** @type {?} */
        App.prototype._title;
        /** @type {?} */
        App.prototype._titleSrv;
        /** @type {?} */
        App.prototype._rootNav;
        /** @type {?} */
        App.prototype._disableScrollAssist;
        /**
         * @hidden
         * @type {?}
         */
        App.prototype._clickBlock;
        /**
         * @hidden
         * @type {?}
         */
        App.prototype._appRoot;
        /**
         * Observable that emits whenever a view loads in the app.
         * @type {?}
         */
        App.prototype.viewDidLoad;
        /**
         * Observable that emits before any view is entered in the app.
         * @type {?}
         */
        App.prototype.viewWillEnter;
        /**
         * Observable that emits after any view is entered in the app.
         * @type {?}
         */
        App.prototype.viewDidEnter;
        /**
         * Observable that emits before any view is exited in the app.
         * @type {?}
         */
        App.prototype.viewWillLeave;
        /**
         * Observable that emits after any view is exited in the app.
         * @type {?}
         */
        App.prototype.viewDidLeave;
        /**
         * Observable that emits before any view unloads in the app.
         * @type {?}
         */
        App.prototype.viewWillUnload;
        /** @type {?} */
        App.prototype._config;
        /** @type {?} */
        App.prototype._plt;
        /** @type {?} */
        App.prototype._menuCtrl;
    }
    /**
     * @param {?} nav
     * @return {?}
     */
    function recursivePop(nav) {
        if (!nav) {
            return null;
        }
        if (nav_util_1.isNav(nav)) {
            var /** @type {?} */ len = nav.length();
            if (len > 1 || (nav._isPortal && len > 0)) {
                // this nav controller has more than one view
                // pop the current view on this nav and we're done here
                (void 0) /* console.debug */;
                return nav.pop();
            }
        }
        // try again using the parent nav (if there is one)
        return recursivePop(nav.parent);
    }
    /**
     * @param {?} nav
     * @return {?}
     */
    function findTopNav(nav) {
        var /** @type {?} */ activeChildNav;
        while (nav) {
            activeChildNav = nav.getActiveChildNav();
            if (!activeChildNav) {
                break;
            }
            nav = activeChildNav;
        }
        return nav;
    }
    var /** @type {?} */ ACTIVE_SCROLLING_TIME = 100;
    var /** @type {?} */ CLICK_BLOCK_BUFFER_IN_MILLIS = 64;
});
//# sourceMappingURL=app.js.map