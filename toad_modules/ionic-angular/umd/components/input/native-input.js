(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/forms", "../../config/config", "../../platform/platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var forms_1 = require("@angular/forms");
    var config_1 = require("../../config/config");
    var platform_1 = require("../../platform/platform");
    /**
     * @hidden
     */
    var NativeInput = (function () {
        /**
         * @param {?} _elementRef
         * @param {?} _renderer
         * @param {?} config
         * @param {?} _plt
         * @param {?} ngControl
         */
        function NativeInput(_elementRef, _renderer, config, _plt, ngControl) {
            this._elementRef = _elementRef;
            this._renderer = _renderer;
            this._plt = _plt;
            this.ngControl = ngControl;
            this.focusChange = new core_1.EventEmitter();
            this.valueChange = new core_1.EventEmitter();
            this.keydown = new core_1.EventEmitter();
            this._clone = config.getBoolean('inputCloning', false);
            this._blurring = config.getBoolean('inputBlurring', false);
        }
        /**
         * @param {?} ev
         * @return {?}
         */
        NativeInput.prototype._change = function (ev) {
            this.valueChange.emit(ev.target.value);
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        NativeInput.prototype._keyDown = function (ev) {
            if (ev) {
                ev.target && this.keydown.emit(ev.target.value);
            }
        };
        /**
         * @return {?}
         */
        NativeInput.prototype._focus = function () {
            var /** @type {?} */ self = this;
            self.focusChange.emit(true);
            if (self._blurring) {
                // automatically blur input if:
                // 1) this input has focus
                // 2) the newly tapped document element is not an input
                (void 0) /* console.debug */;
                var /** @type {?} */ unregTouchEnd = this._plt.registerListener(this._plt.doc(), 'touchend', function (ev) {
                    var /** @type {?} */ tapped = (ev.target);
                    if (tapped && self.element()) {
                        if (tapped.tagName !== 'INPUT' && tapped.tagName !== 'TEXTAREA' && !tapped.classList.contains('input-cover')) {
                            self.element().blur();
                        }
                    }
                }, {
                    capture: true,
                    zone: false
                });
                self._unrefBlur = function () {
                    (void 0) /* console.debug */;
                    unregTouchEnd();
                };
            }
        };
        /**
         * @return {?}
         */
        NativeInput.prototype._blur = function () {
            this.focusChange.emit(false);
            this.hideFocus(false);
            this._unrefBlur && this._unrefBlur();
            this._unrefBlur = null;
        };
        /**
         * @param {?} val
         * @return {?}
         */
        NativeInput.prototype.labelledBy = function (val) {
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-labelledby', val);
        };
        /**
         * @param {?} val
         * @return {?}
         */
        NativeInput.prototype.isDisabled = function (val) {
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'disabled', val ? '' : null);
        };
        /**
         * @return {?}
         */
        NativeInput.prototype.setFocus = function () {
            // let's set focus to the element
            // but only if it does not already have focus
            if (this._plt.getActiveElement() !== this.element()) {
                this.element().focus();
            }
        };
        /**
         * @param {?} shouldFocus
         * @param {?} inputRelativeY
         * @return {?}
         */
        NativeInput.prototype.beginFocus = function (shouldFocus, inputRelativeY) {
            if (this._relocated !== shouldFocus) {
                var /** @type {?} */ focusedInputEle = this.element();
                if (shouldFocus) {
                    // we should focus into this element
                    if (this._clone) {
                        // this platform needs the input to be cloned
                        // this allows for the actual input to receive the focus from
                        // the user's touch event, but before it receives focus, it
                        // moves the actual input to a location that will not screw
                        // up the app's layout, and does not allow the native browser
                        // to attempt to scroll the input into place (messing up headers/footers)
                        // the cloned input fills the area of where native input should be
                        // while the native input fakes out the browser by relocating itself
                        // before it receives the actual focus event
                        cloneInputComponent(this._plt, focusedInputEle);
                        // move the native input to a location safe to receive focus
                        // according to the browser, the native input receives focus in an
                        // area which doesn't require the browser to scroll the input into place
                        ((focusedInputEle.style))[this._plt.Css.transform] = "translate3d(-9999px," + inputRelativeY + "px,0)";
                        focusedInputEle.style.opacity = '0';
                    }
                    // let's now set focus to the actual native element
                    // at this point it is safe to assume the browser will not attempt
                    // to scroll the input into view itself (screwing up headers/footers)
                    this.setFocus();
                }
                else {
                    // should remove the focus
                    if (this._clone) {
                        // should remove the cloned node
                        removeClone(this._plt, focusedInputEle);
                    }
                }
                this._relocated = shouldFocus;
            }
        };
        /**
         * @param {?} shouldHideFocus
         * @return {?}
         */
        NativeInput.prototype.hideFocus = function (shouldHideFocus) {
            var /** @type {?} */ focusedInputEle = this.element();
            (void 0) /* console.debug */;
            if (shouldHideFocus) {
                cloneInputComponent(this._plt, focusedInputEle);
                ((focusedInputEle.style))[this._plt.Css.transform] = 'scale(0)';
            }
            else {
                removeClone(this._plt, focusedInputEle);
            }
        };
        /**
         * @param {?} val
         * @return {?}
         */
        NativeInput.prototype.setValue = function (val) {
            this._elementRef.nativeElement['value'] = val;
        };
        /**
         * @return {?}
         */
        NativeInput.prototype.getValue = function () {
            return this.element().value;
        };
        /**
         * @param {?} val
         * @return {?}
         */
        NativeInput.prototype.setMin = function (val) {
            this._elementRef.nativeElement['min'] = val;
        };
        /**
         * @param {?} val
         * @return {?}
         */
        NativeInput.prototype.setMax = function (val) {
            this._elementRef.nativeElement['max'] = val;
        };
        /**
         * @param {?} val
         * @return {?}
         */
        NativeInput.prototype.setStep = function (val) {
            this._elementRef.nativeElement['step'] = val;
        };
        /**
         * @param {?} cssClass
         * @param {?} shouldAdd
         * @return {?}
         */
        NativeInput.prototype.setElementClass = function (cssClass, shouldAdd) {
            this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, shouldAdd);
        };
        /**
         * @return {?}
         */
        NativeInput.prototype.element = function () {
            return this._elementRef.nativeElement;
        };
        /**
         * @return {?}
         */
        NativeInput.prototype.ngOnDestroy = function () {
            this._unrefBlur && this._unrefBlur();
        };
        return NativeInput;
    }());
    NativeInput.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '.text-input'
                },] },
    ];
    /**
     * @nocollapse
     */
    NativeInput.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: forms_1.NgControl, },
    ]; };
    NativeInput.propDecorators = {
        'focusChange': [{ type: core_1.Output },],
        'valueChange': [{ type: core_1.Output },],
        'keydown': [{ type: core_1.Output },],
        '_change': [{ type: core_1.HostListener, args: ['input', ['$event'],] },],
        '_keyDown': [{ type: core_1.HostListener, args: ['keydown', ['$event'],] },],
        '_focus': [{ type: core_1.HostListener, args: ['focus',] },],
        '_blur': [{ type: core_1.HostListener, args: ['blur',] },],
    };
    exports.NativeInput = NativeInput;
    function NativeInput_tsickle_Closure_declarations() {
        /** @type {?} */
        NativeInput.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NativeInput.ctorParameters;
        /** @type {?} */
        NativeInput.propDecorators;
        /** @type {?} */
        NativeInput.prototype._relocated;
        /** @type {?} */
        NativeInput.prototype._clone;
        /** @type {?} */
        NativeInput.prototype._blurring;
        /** @type {?} */
        NativeInput.prototype._unrefBlur;
        /** @type {?} */
        NativeInput.prototype.focusChange;
        /** @type {?} */
        NativeInput.prototype.valueChange;
        /** @type {?} */
        NativeInput.prototype.keydown;
        /** @type {?} */
        NativeInput.prototype._elementRef;
        /** @type {?} */
        NativeInput.prototype._renderer;
        /** @type {?} */
        NativeInput.prototype._plt;
        /** @type {?} */
        NativeInput.prototype.ngControl;
    }
    /**
     * @param {?} plt
     * @param {?} srcNativeInputEle
     * @return {?}
     */
    function cloneInputComponent(plt, srcNativeInputEle) {
        // given a native <input> or <textarea> element
        // find its parent wrapping component like <ion-input> or <ion-textarea>
        // then clone the entire component
        var /** @type {?} */ srcComponentEle = (srcNativeInputEle.closest('ion-input,ion-textarea'));
        if (srcComponentEle) {
            // DOM READ
            var /** @type {?} */ srcTop = srcComponentEle.offsetTop;
            var /** @type {?} */ srcLeft = srcComponentEle.offsetLeft;
            var /** @type {?} */ srcWidth = srcComponentEle.offsetWidth;
            var /** @type {?} */ srcHeight = srcComponentEle.offsetHeight;
            // DOM WRITE
            // not using deep clone so we don't pull in unnecessary nodes
            var /** @type {?} */ clonedComponentEle = (srcComponentEle.cloneNode(false));
            clonedComponentEle.classList.add('cloned-input');
            clonedComponentEle.setAttribute('aria-hidden', 'true');
            clonedComponentEle.style.pointerEvents = 'none';
            clonedComponentEle.style.position = 'absolute';
            clonedComponentEle.style.top = srcTop + 'px';
            clonedComponentEle.style.left = srcLeft + 'px';
            clonedComponentEle.style.width = srcWidth + 'px';
            clonedComponentEle.style.height = srcHeight + 'px';
            var /** @type {?} */ clonedNativeInputEle = (srcNativeInputEle.cloneNode(false));
            clonedNativeInputEle.value = srcNativeInputEle.value;
            clonedNativeInputEle.tabIndex = -1;
            clonedComponentEle.appendChild(clonedNativeInputEle);
            srcComponentEle.parentNode.appendChild(clonedComponentEle);
            srcComponentEle.style.pointerEvents = 'none';
        }
        ((srcNativeInputEle.style))[plt.Css.transform] = 'scale(0)';
    }
    /**
     * @param {?} plt
     * @param {?} srcNativeInputEle
     * @return {?}
     */
    function removeClone(plt, srcNativeInputEle) {
        var /** @type {?} */ srcComponentEle = (srcNativeInputEle.closest('ion-input,ion-textarea'));
        if (srcComponentEle && srcComponentEle.parentElement) {
            var /** @type {?} */ clonedInputEles = srcComponentEle.parentElement.querySelectorAll('.cloned-input');
            for (var /** @type {?} */ i = 0; i < clonedInputEles.length; i++) {
                clonedInputEles[i].parentNode.removeChild(clonedInputEles[i]);
            }
            srcComponentEle.style.pointerEvents = '';
        }
        ((srcNativeInputEle.style))[plt.Css.transform] = '';
        srcNativeInputEle.style.opacity = '';
    }
});
//# sourceMappingURL=native-input.js.map