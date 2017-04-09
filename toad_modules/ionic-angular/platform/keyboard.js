import { Injectable, NgZone } from '@angular/core';
import { Config } from '../config/config';
import { DomController } from './dom-controller';
import { isTextInput } from '../util/dom';
import { KEY_TAB } from './key';
import { Platform } from './platform';
/**
 * \@name Keyboard
 * \@description
 * The `Keyboard` class allows you to work with the keyboard events provided
 * by the Ionic keyboard plugin.
 *
 * \@usage
 * ```ts
 * export class MyClass {
 *   constructor(public keyboard: Keyboard) {
 *
 *   }
 * }
 * ```
 */
var Keyboard = (function () {
    /**
     * @param {?} config
     * @param {?} _plt
     * @param {?} _zone
     * @param {?} _dom
     */
    function Keyboard(config, _plt, _zone, _dom) {
        var _this = this;
        this._plt = _plt;
        this._zone = _zone;
        this._dom = _dom;
        this.focusOutline(config.get('focusOutline'));
        var win = _plt.win();
        _plt.registerListener(win, 'native.keyboardhide', function () {
            _plt.cancelTimeout(_this._tmr);
            _this._tmr = _plt.timeout(function () {
                // this custom cordova plugin event fires when the keyboard will hide
                // useful when the virtual keyboard is closed natively
                // https://github.com/driftyco/ionic-plugin-keyboard
                if (_this.isOpen()) {
                    _this._plt.focusOutActiveElement();
                }
            }, 80);
        }, { zone: false, passive: true });
        _plt.registerListener(win, 'native.keyboardshow', function () {
            _plt.cancelTimeout(_this._tmr);
        }, { zone: false, passive: true });
    }
    /**
     * Check to see if the keyboard is open or not.
     *
     * ```ts
     * export class MyClass {
     *   constructor(public keyboard: Keyboard) {
     *
     *   }
     *
     *   keyboardCheck() {
     *     console.log('The keyboard is open:', this.keyboard.isOpen());
     *   }
     * }
     * ```
     *
     * @return {?}
     */
    Keyboard.prototype.isOpen = function () {
        return this.hasFocusedTextInput();
    };
    /**
     * When the keyboard is closed, call any methods you want.
     *
     * ```ts
     * export class MyClass {
     *   constructor(public keyboard: Keyboard) {
     *     this.keyboard.onClose(this.closeCallback);
     *   }
     *   closeCallback() {
     *     // call what ever functionality you want on keyboard close
     *     console.log('Closing time');
     *   }
     * }
     * ```
     *
     * @param {?} callback
     * @param {?=} pollingInternval
     * @param {?=} pollingChecksMax
     * @return {?}
     */
    Keyboard.prototype.onClose = function (callback, pollingInternval, pollingChecksMax) {
        if (pollingInternval === void 0) { pollingInternval = KEYBOARD_CLOSE_POLLING; }
        if (pollingChecksMax === void 0) { pollingChecksMax = KEYBOARD_POLLING_CHECKS_MAX; }
        (void 0) /* console.debug */;
        var /** @type {?} */ self = this;
        var /** @type {?} */ checks = 0;
        var /** @type {?} */ promise = null;
        if (!callback) {
            // a callback wasn't provided, so let's return a promise instead
            promise = new Promise(function (resolve) { callback = resolve; });
        }
        /**
         * @return {?}
         */
        function checkKeyboard() {
            (void 0) /* console.debug */;
            if (!self.isOpen() || checks > pollingChecksMax) {
                self._plt.timeout(function () {
                    self._zone.run(function () {
                        (void 0) /* console.debug */;
                        callback();
                    });
                }, 400);
            }
            else {
                self._plt.timeout(checkKeyboard, pollingInternval);
            }
            checks++;
        }
        self._plt.timeout(checkKeyboard, pollingInternval);
        return promise;
    };
    /**
     * Programmatically close the keyboard.
     * @return {?}
     */
    Keyboard.prototype.close = function () {
        var _this = this;
        this._dom.read(function () {
            if (_this.isOpen()) {
                // only focus out when a text input has focus
                (void 0) /* console.debug */;
                _this._dom.write(function () {
                    _this._plt.focusOutActiveElement();
                });
            }
        });
    };
    /**
     * @hidden
     * @param {?} setting
     * @return {?}
     */
    Keyboard.prototype.focusOutline = function (setting) {
        /* Focus Outline
         * --------------------------------------------------
         * By default, when a keydown event happens from a tab key, then
         * the 'focus-outline' css class is added to the body element
         * so focusable elements have an outline. On a mousedown or
         * touchstart event, then the 'focus-outline' css class is removed.
         *
         * Config default overrides:
         * focusOutline: true     - Always add the focus-outline
         * focusOutline: false    - Do not add the focus-outline
         */
        var /** @type {?} */ self = this;
        var /** @type {?} */ platform = self._plt;
        var /** @type {?} */ doc = platform.doc();
        var /** @type {?} */ isKeyInputEnabled = false;
        var /** @type {?} */ unRegMouse;
        var /** @type {?} */ unRegTouch;
        var /** @type {?} */ evOpts = { passive: true, zone: false };
        /**
         * @return {?}
         */
        function cssClass() {
            self._dom.write(function () {
                ((platform.doc().body.classList))[isKeyInputEnabled ? 'add' : 'remove']('focus-outline');
            });
        }
        if (setting === true) {
            isKeyInputEnabled = true;
            return cssClass();
        }
        else if (setting === false) {
            return;
        }
        /**
         * @param {?} ev
         * @return {?}
         */
        function keyDown(ev) {
            if (!isKeyInputEnabled && ev.keyCode === KEY_TAB) {
                isKeyInputEnabled = true;
                enableKeyInput();
            }
        }
        /**
         * @return {?}
         */
        function pointerDown() {
            isKeyInputEnabled = false;
            enableKeyInput();
        }
        /**
         * @return {?}
         */
        function enableKeyInput() {
            cssClass();
            unRegMouse && unRegMouse();
            unRegTouch && unRegTouch();
            if (isKeyInputEnabled) {
                // listen for when a mousedown or touchstart event happens
                unRegMouse = platform.registerListener(doc, 'mousedown', pointerDown, evOpts);
                unRegTouch = platform.registerListener(doc, 'touchstart', pointerDown, evOpts);
            }
        }
        // always listen for tab keydown events
        platform.registerListener(platform.doc(), 'keydown', keyDown, evOpts);
    };
    /**
     * @return {?}
     */
    Keyboard.prototype.hasFocusedTextInput = function () {
        var /** @type {?} */ activeEle = this._plt.getActiveElement();
        if (isTextInput(activeEle)) {
            return (activeEle.parentElement.querySelector(':focus') === activeEle);
        }
        return false;
    };
    return Keyboard;
}());
export { Keyboard };
Keyboard.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Keyboard.ctorParameters = function () { return [
    { type: Config, },
    { type: Platform, },
    { type: NgZone, },
    { type: DomController, },
]; };
function Keyboard_tsickle_Closure_declarations() {
    /** @type {?} */
    Keyboard.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Keyboard.ctorParameters;
    /** @type {?} */
    Keyboard.prototype._tmr;
    /** @type {?} */
    Keyboard.prototype._plt;
    /** @type {?} */
    Keyboard.prototype._zone;
    /** @type {?} */
    Keyboard.prototype._dom;
}
var /** @type {?} */ KEYBOARD_CLOSE_POLLING = 150;
var /** @type {?} */ KEYBOARD_POLLING_CHECKS_MAX = 100;
//# sourceMappingURL=keyboard.js.map