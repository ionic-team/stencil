import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
/**
 * @hidden
 */
export class NativeInput {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} config
     * @param {?} _plt
     * @param {?} ngControl
     */
    constructor(_elementRef, _renderer, config, _plt, ngControl) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._plt = _plt;
        this.ngControl = ngControl;
        this.focusChange = new EventEmitter();
        this.valueChange = new EventEmitter();
        this.keydown = new EventEmitter();
        this._clone = config.getBoolean('inputCloning', false);
        this._blurring = config.getBoolean('inputBlurring', false);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _change(ev) {
        this.valueChange.emit(ev.target.value);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _keyDown(ev) {
        if (ev) {
            ev.target && this.keydown.emit(ev.target.value);
        }
    }
    /**
     * @return {?}
     */
    _focus() {
        var /** @type {?} */ self = this;
        self.focusChange.emit(true);
        if (self._blurring) {
            // automatically blur input if:
            // 1) this input has focus
            // 2) the newly tapped document element is not an input
            (void 0) /* console.debug */;
            var /** @type {?} */ unregTouchEnd = this._plt.registerListener(this._plt.doc(), 'touchend', (ev) => {
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
    }
    /**
     * @return {?}
     */
    _blur() {
        this.focusChange.emit(false);
        this.hideFocus(false);
        this._unrefBlur && this._unrefBlur();
        this._unrefBlur = null;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    labelledBy(val) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-labelledby', val);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    isDisabled(val) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, 'disabled', val ? '' : null);
    }
    /**
     * @return {?}
     */
    setFocus() {
        // let's set focus to the element
        // but only if it does not already have focus
        if (this._plt.getActiveElement() !== this.element()) {
            this.element().focus();
        }
    }
    /**
     * @param {?} shouldFocus
     * @param {?} inputRelativeY
     * @return {?}
     */
    beginFocus(shouldFocus, inputRelativeY) {
        if (this._relocated !== shouldFocus) {
            const /** @type {?} */ focusedInputEle = this.element();
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
                    ((focusedInputEle.style))[this._plt.Css.transform] = `translate3d(-9999px,${inputRelativeY}px,0)`;
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
    }
    /**
     * @param {?} shouldHideFocus
     * @return {?}
     */
    hideFocus(shouldHideFocus) {
        let /** @type {?} */ focusedInputEle = this.element();
        (void 0) /* console.debug */;
        if (shouldHideFocus) {
            cloneInputComponent(this._plt, focusedInputEle);
            ((focusedInputEle.style))[this._plt.Css.transform] = 'scale(0)';
        }
        else {
            removeClone(this._plt, focusedInputEle);
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setValue(val) {
        this._elementRef.nativeElement['value'] = val;
    }
    /**
     * @return {?}
     */
    getValue() {
        return this.element().value;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setMin(val) {
        this._elementRef.nativeElement['min'] = val;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setMax(val) {
        this._elementRef.nativeElement['max'] = val;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setStep(val) {
        this._elementRef.nativeElement['step'] = val;
    }
    /**
     * @param {?} cssClass
     * @param {?} shouldAdd
     * @return {?}
     */
    setElementClass(cssClass, shouldAdd) {
        this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, shouldAdd);
    }
    /**
     * @return {?}
     */
    element() {
        return this._elementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._unrefBlur && this._unrefBlur();
    }
}
NativeInput.decorators = [
    { type: Directive, args: [{
                selector: '.text-input'
            },] },
];
/**
 * @nocollapse
 */
NativeInput.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer, },
    { type: Config, },
    { type: Platform, },
    { type: NgControl, },
];
NativeInput.propDecorators = {
    'focusChange': [{ type: Output },],
    'valueChange': [{ type: Output },],
    'keydown': [{ type: Output },],
    '_change': [{ type: HostListener, args: ['input', ['$event'],] },],
    '_keyDown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    '_focus': [{ type: HostListener, args: ['focus',] },],
    '_blur': [{ type: HostListener, args: ['blur',] },],
};
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
    const /** @type {?} */ srcComponentEle = (srcNativeInputEle.closest('ion-input,ion-textarea'));
    if (srcComponentEle) {
        // DOM READ
        const /** @type {?} */ srcTop = srcComponentEle.offsetTop;
        const /** @type {?} */ srcLeft = srcComponentEle.offsetLeft;
        const /** @type {?} */ srcWidth = srcComponentEle.offsetWidth;
        const /** @type {?} */ srcHeight = srcComponentEle.offsetHeight;
        // DOM WRITE
        // not using deep clone so we don't pull in unnecessary nodes
        const /** @type {?} */ clonedComponentEle = (srcComponentEle.cloneNode(false));
        clonedComponentEle.classList.add('cloned-input');
        clonedComponentEle.setAttribute('aria-hidden', 'true');
        clonedComponentEle.style.pointerEvents = 'none';
        clonedComponentEle.style.position = 'absolute';
        clonedComponentEle.style.top = srcTop + 'px';
        clonedComponentEle.style.left = srcLeft + 'px';
        clonedComponentEle.style.width = srcWidth + 'px';
        clonedComponentEle.style.height = srcHeight + 'px';
        const /** @type {?} */ clonedNativeInputEle = (srcNativeInputEle.cloneNode(false));
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
    const /** @type {?} */ srcComponentEle = (srcNativeInputEle.closest('ion-input,ion-textarea'));
    if (srcComponentEle && srcComponentEle.parentElement) {
        const /** @type {?} */ clonedInputEles = srcComponentEle.parentElement.querySelectorAll('.cloned-input');
        for (var /** @type {?} */ i = 0; i < clonedInputEles.length; i++) {
            clonedInputEles[i].parentNode.removeChild(clonedInputEles[i]);
        }
        srcComponentEle.style.pointerEvents = '';
    }
    ((srcNativeInputEle.style))[plt.Css.transform] = '';
    srcNativeInputEle.style.opacity = '';
}
//# sourceMappingURL=native-input.js.map