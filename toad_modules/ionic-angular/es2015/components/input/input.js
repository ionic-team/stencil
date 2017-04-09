import { Component, Optional, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { copyInputAttributes, hasPointerMoved, pointerCoord } from '../../util/dom';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { isString, isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { NativeInput } from './native-input';
import { NextInput } from './next-input';
import { NavController } from '../../navigation/nav-controller';
import { Platform } from '../../platform/platform';
/**
 * \@name Input
 * \@description
 *
 * `ion-input` is meant for text type inputs only, such as `text`,
 * `password`, `email`, `number`, `search`, `tel`, and `url`. Ionic
 * still uses an actual `<input type="text">` HTML element within the
 * component, however, with Ionic wrapping the native HTML input
 * element it's better able to handle the user experience and
 * interactivity.
 *
 * Similarly, `<ion-textarea>` should be used in place of `<textarea>`.
 *
 * An `ion-input` is **not** used for non-text type inputs, such as a
 * `checkbox`, `radio`, `toggle`, `range`, `select`, etc.
 *
 * Along with the blur/focus events, `input` support all standard text input
 * events like `keyup`, `keydown`, `keypress`, `input`,etc. Any standard event
 * can be attached and will function as expected.
 *
 * \@usage
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-label color="primary">Inline Label</ion-label>
 *     <ion-input placeholder="Text Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" fixed>Fixed Label</ion-label>
 *     <ion-input type="tel" placeholder="Tel Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input type="number" placeholder="Number Input with no label"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="email" placeholder="Email Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="password" placeholder="Password Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" floating>Floating Label</ion-label>
 *     <ion-input></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input placeholder="Clear Input" clearInput></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-textarea placeholder="Enter a description"></ion-textarea>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * \@demo /docs/demos/src/input/
 */
export class TextInput extends Ion {
    /**
     * @param {?} config
     * @param {?} _plt
     * @param {?} _form
     * @param {?} _app
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _content
     * @param {?} _item
     * @param {?} nav
     * @param {?} ngControl
     * @param {?} _dom
     */
    constructor(config, _plt, _form, _app, elementRef, renderer, _content, _item, nav, ngControl, _dom) {
        super(config, elementRef, renderer, 'input');
        this._plt = _plt;
        this._form = _form;
        this._app = _app;
        this._content = _content;
        this._item = _item;
        this.ngControl = ngControl;
        this._dom = _dom;
        this._clearInput = false;
        this._disabled = false;
        this._readonly = false;
        this._type = 'text';
        this._value = '';
        /**
         * \@input {string} Instructional text that shows before the input has a value.
         */
        this.placeholder = '';
        /**
         * \@output {event} Emitted when the input no longer has focus.
         */
        this.blur = new EventEmitter();
        /**
         * \@output {event} Emitted when the input has focus.
         */
        this.focus = new EventEmitter();
        this._nav = nav;
        this._autoFocusAssist = config.get('autoFocusAssist', 'delay');
        this._autoComplete = config.get('autocomplete', 'off');
        this._autoCorrect = config.get('autocorrect', 'off');
        this._keyboardHeight = config.getNumber('keyboardHeight');
        this._useAssist = config.getBoolean('scrollAssist', false);
        this._usePadding = config.getBoolean('scrollPadding', this._useAssist);
        if (elementRef.nativeElement.tagName === 'ION-TEXTAREA') {
            this._type = TEXTAREA;
        }
        if (ngControl) {
            ngControl.valueAccessor = this;
            this.inputControl = ngControl;
        }
        _form.register(this);
        // only listen to content scroll events if there is content
        if (_content) {
            this._scrollStart = _content.ionScrollStart.subscribe((ev) => {
                this.scrollHideFocus(ev, true);
            });
            this._scrollEnd = _content.ionScrollEnd.subscribe((ev) => {
                this.scrollHideFocus(ev, false);
            });
        }
        this.mode = config.get('mode');
    }
    /**
     * \@input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input.
     * @return {?}
     */
    get clearInput() {
        return this._clearInput;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set clearInput(val) {
        this._clearInput = (this._type !== TEXTAREA && isTrueProperty(val));
    }
    /**
     * \@input {string} The text value of the input.
     * @return {?}
     */
    get value() {
        return this._value;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set value(val) {
        this._value = val;
        this.checkHasValue(val);
    }
    /**
     * \@input {string} The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
     * @return {?}
     */
    get type() {
        return this._type;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set type(val) {
        if (this._type !== TEXTAREA) {
            this._type = 'text';
            if (isString(val)) {
                val = val.toLowerCase();
                if (TEXT_TYPE_REGEX.test(val)) {
                    this._type = val;
                }
            }
        }
    }
    /**
     * \@input {boolean} If true, the user cannot interact with this element.
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set disabled(val) {
        this.setDisabled(this._disabled = isTrueProperty(val));
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    setDisabled(val) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, 'disabled', val ? '' : null);
        this._item && this._item.setElementClass('item-input-disabled', val);
        this._native && this._native.isDisabled(val);
    }
    /**
     * @hidden
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * \@input {boolean} If true, the user cannot modify the value.
     * @return {?}
     */
    get readonly() {
        return this._readonly;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set readonly(val) {
        this._readonly = isTrueProperty(val);
    }
    /**
     * \@input {boolean} If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
     * @return {?}
     */
    get clearOnEdit() {
        return this._clearOnEdit;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set clearOnEdit(val) {
        this._clearOnEdit = isTrueProperty(val);
    }
    /**
     * \@input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
     * @return {?}
     */
    get min() {
        return this._min;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set min(val) {
        this.setMin(this._min = val);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    setMin(val) {
        this._native && this._native.setMin(val);
    }
    /**
     * \@input {any} The maximum value, which must not be less than its minimum (min attribute) value.
     * @return {?}
     */
    get max() {
        return this._max;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set max(val) {
        this.setMax(this._max = val);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    setMax(val) {
        this._native && this._native.setMax(val);
    }
    /**
     * \@input {any} Works with the min and max attributes to limit the increments at which a value can be set.
     * @return {?}
     */
    get step() {
        return this._step;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set step(val) {
        this.setStep(this._step = val);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    setStep(val) {
        this._native && this._native.setStep(val);
    }
    /**
     * @hidden
     * @param {?} nativeInput
     * @return {?}
     */
    set _nativeInput(nativeInput) {
        if (this.type !== TEXTAREA) {
            this.setNativeInput(nativeInput);
        }
    }
    /**
     * @hidden
     * @param {?} nativeInput
     * @return {?}
     */
    set _nativeTextarea(nativeInput) {
        if (this.type === TEXTAREA) {
            this.setNativeInput(nativeInput);
        }
    }
    /**
     * @hidden
     * @param {?} nextInput
     * @return {?}
     */
    set _nextInput(nextInput) {
        if (nextInput) {
            nextInput.focused.subscribe(() => {
                this._form.tabFocus(this);
            });
        }
    }
    /**
     * @hidden
     * @param {?} nativeInput
     * @return {?}
     */
    setNativeInput(nativeInput) {
        this._native = nativeInput;
        nativeInput.setValue(this._value);
        nativeInput.setMin(this._min);
        nativeInput.setMax(this._max);
        nativeInput.setStep(this._step);
        nativeInput.isDisabled(this.disabled);
        if (this._item && this._item.labelId !== null) {
            nativeInput.labelledBy(this._item.labelId);
        }
        nativeInput.valueChange.subscribe((inputValue) => {
            this.onChange(inputValue);
            this.checkHasValue(inputValue);
        });
        nativeInput.keydown.subscribe((inputValue) => {
            this.onKeydown(inputValue);
        });
        this.focusChange(this.hasFocus());
        nativeInput.focusChange.subscribe((textInputHasFocus) => {
            this.focusChange(textInputHasFocus);
            this.checkHasValue(nativeInput.getValue());
            if (!textInputHasFocus) {
                this.onTouched(textInputHasFocus);
            }
        });
        this.checkHasValue(nativeInput.getValue());
        var /** @type {?} */ ionInputEle = this._elementRef.nativeElement;
        var /** @type {?} */ nativeInputEle = nativeInput.element();
        // copy ion-input attributes to the native input element
        copyInputAttributes(ionInputEle, nativeInputEle);
        if (ionInputEle.hasAttribute('autofocus')) {
            // the ion-input element has the autofocus attributes
            ionInputEle.removeAttribute('autofocus');
            if (this._autoFocusAssist === 'immediate') {
                // config says to immediate focus on the input
                // works best on android devices
                nativeInputEle.focus();
            }
            else if (this._autoFocusAssist === 'delay') {
                // config says to chill out a bit and focus on the input after transitions
                // works best on desktop
                this._plt.timeout(() => {
                    nativeInputEle.focus();
                }, 650);
            }
            // traditionally iOS has big issues with autofocus on actual devices
            // autoFocus is disabled by default with the iOS mode config
        }
        // by default set autocomplete="off" unless specified by the input
        if (ionInputEle.hasAttribute('autocomplete')) {
            this._autoComplete = ionInputEle.getAttribute('autocomplete');
        }
        nativeInputEle.setAttribute('autocomplete', this._autoComplete);
        // by default set autocorrect="off" unless specified by the input
        if (ionInputEle.hasAttribute('autocorrect')) {
            this._autoCorrect = ionInputEle.getAttribute('autocorrect');
        }
        nativeInputEle.setAttribute('autocorrect', this._autoCorrect);
    }
    /**
     * @hidden
     * @return {?}
     */
    initFocus() {
        // begin the process of setting focus to the inner input element
        const /** @type {?} */ app = this._app;
        const /** @type {?} */ content = this._content;
        const /** @type {?} */ nav = this._nav;
        const /** @type {?} */ nativeInput = this._native;
        (void 0) /* console.debug */;
        if (content) {
            // this input is inside of a scroll view
            // find out if text input should be manually scrolled into view
            // get container of this input, probably an ion-item a few nodes up
            var /** @type {?} */ ele = this._elementRef.nativeElement;
            ele = (ele.closest('ion-item,[ion-item]')) || ele;
            var /** @type {?} */ scrollData = getScrollData(ele.offsetTop, ele.offsetHeight, content.getContentDimensions(), this._keyboardHeight, this._plt.height());
            if (Math.abs(scrollData.scrollAmount) < 4) {
                // the text input is in a safe position that doesn't
                // require it to be scrolled into view, just set focus now
                this.setFocus();
                // all good, allow clicks again
                app.setEnabled(true);
                nav && nav.setTransitioning(false);
                if (this._usePadding) {
                    content.clearScrollPaddingFocusOut();
                }
                return;
            }
            if (this._usePadding) {
                // add padding to the bottom of the scroll view (if needed)
                content.addScrollPadding(scrollData.scrollPadding);
            }
            // manually scroll the text input to the top
            // do not allow any clicks while it's scrolling
            var /** @type {?} */ scrollDuration = getScrollAssistDuration(scrollData.scrollAmount);
            app.setEnabled(false, scrollDuration);
            nav && nav.setTransitioning(true);
            // temporarily move the focus to the focus holder so the browser
            // doesn't freak out while it's trying to get the input in place
            // at this point the native text input still does not have focus
            nativeInput.beginFocus(true, scrollData.inputSafeY);
            // scroll the input into place
            content.scrollTo(0, scrollData.scrollTo, scrollDuration, () => {
                (void 0) /* console.debug */;
                // the scroll view is in the correct position now
                // give the native text input focus
                nativeInput.beginFocus(false, 0);
                // ensure this is the focused input
                this.setFocus();
                // all good, allow clicks again
                app.setEnabled(true);
                nav && nav.setTransitioning(false);
                if (this._usePadding) {
                    content.clearScrollPaddingFocusOut();
                }
            });
        }
        else {
            // not inside of a scroll view, just focus it
            this.setFocus();
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    setFocus() {
        // immediately set focus
        this._form.setAsFocused(this);
        // set focus on the actual input element
        (void 0) /* console.debug */;
        this._native.setFocus();
        // ensure the body hasn't scrolled down
        this._dom.write(() => {
            this._plt.doc().body.scrollTop = 0;
        });
    }
    /**
     * @hidden
     * @param {?} ev
     * @param {?} shouldHideFocus
     * @return {?}
     */
    scrollHideFocus(ev, shouldHideFocus) {
        // do not continue if there's no nav, or it's transitioning
        if (this._nav && this.hasFocus()) {
            // if it does have focus, then do the dom write
            this._dom.write(() => {
                this._native.hideFocus(shouldHideFocus);
            });
        }
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    inputBlurred(ev) {
        this.blur.emit(ev);
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    inputFocused(ev) {
        this.focus.emit(ev);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    writeValue(val) {
        this._value = val;
        this.checkHasValue(val);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    onChange(val) {
        this.checkHasValue(val);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    onKeydown(val) {
        if (this._clearOnEdit) {
            this.checkClearOnEdit(val);
        }
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    onTouched(val) { }
    /**
     * @hidden
     * @return {?}
     */
    hasFocus() {
        // check if an input has focus or not
        return this._plt.hasFocus(this._native.element());
    }
    /**
     * @hidden
     * @return {?}
     */
    hasValue() {
        const /** @type {?} */ inputValue = this._value;
        return (inputValue !== null && inputValue !== undefined && inputValue !== '');
    }
    /**
     * @hidden
     * @param {?} inputValue
     * @return {?}
     */
    checkHasValue(inputValue) {
        if (this._item) {
            var /** @type {?} */ hasValue = (inputValue !== null && inputValue !== undefined && inputValue !== '');
            this._item.setElementClass('input-has-value', hasValue);
        }
    }
    /**
     * @hidden
     * @param {?} inputHasFocus
     * @return {?}
     */
    focusChange(inputHasFocus) {
        if (this._item) {
            (void 0) /* console.debug */;
            this._item.setElementClass('input-has-focus', inputHasFocus);
        }
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (this._clearOnEdit && !inputHasFocus && this.hasValue()) {
            this._didBlurAfterEdit = true;
        }
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    pointerStart(ev) {
        // input cover touchstart
        if (ev.type === 'touchstart') {
            this._isTouch = true;
        }
        if ((this._isTouch || (!this._isTouch && ev.type === 'mousedown')) && this._app.isEnabled()) {
            // remember where the touchstart/mousedown started
            this._coord = pointerCoord(ev);
        }
        (void 0) /* console.debug */;
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    pointerEnd(ev) {
        // input cover touchend/mouseup
        (void 0) /* console.debug */;
        if ((this._isTouch && ev.type === 'mouseup') || !this._app.isEnabled()) {
            // the app is actively doing something right now
            // don't try to scroll in the input
            ev.preventDefault();
            ev.stopPropagation();
        }
        else if (this._coord) {
            // get where the touchend/mouseup ended
            let /** @type {?} */ endCoord = pointerCoord(ev);
            // focus this input if the pointer hasn't moved XX pixels
            // and the input doesn't already have focus
            if (!hasPointerMoved(8, this._coord, endCoord) && !this.hasFocus()) {
                ev.preventDefault();
                ev.stopPropagation();
                // begin the input focus process
                this.initFocus();
            }
        }
        this._coord = null;
    }
    /**
     * @hidden
     * @return {?}
     */
    setItemInputControlCss() {
        let /** @type {?} */ item = this._item;
        let /** @type {?} */ nativeInput = this._native;
        let /** @type {?} */ inputControl = this.inputControl;
        // Set the control classes on the item
        if (item && inputControl) {
            setControlCss(item, inputControl);
        }
        // Set the control classes on the native input
        if (nativeInput && inputControl) {
            setControlCss(nativeInput, inputControl);
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ item = this._item;
        if (item) {
            if (this.type === TEXTAREA) {
                item.setElementClass('item-textarea', true);
            }
            item.setElementClass('item-input', true);
            item.registerInput(this.type);
        }
        // By default, password inputs clear after focus when they have content
        if (this.type === 'password' && this.clearOnEdit !== false) {
            this.clearOnEdit = true;
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngAfterContentChecked() {
        this.setItemInputControlCss();
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        this._form.deregister(this);
        // only stop listening to content scroll events if there is content
        if (this._content) {
            this._scrollStart.unsubscribe();
            this._scrollEnd.unsubscribe();
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    clearTextInput() {
        (void 0) /* console.debug */;
        this._value = '';
        this.onChange(this._value);
        this.writeValue(this._value);
    }
    /**
     * Check if we need to clear the text input if clearOnEdit is enabled
     * @hidden
     * @param {?} inputValue
     * @return {?}
     */
    checkClearOnEdit(inputValue) {
        if (!this._clearOnEdit) {
            return;
        }
        // Did the input value change after it was blurred and edited?
        if (this._didBlurAfterEdit && this.hasValue()) {
            // Clear the input
            this.clearTextInput();
        }
        // Reset the flag
        this._didBlurAfterEdit = false;
    }
    /**
     * @hidden
     * Angular2 Forms API method called by the view (formControlName) to register the
     * onChange event handler that updates the model (Control).
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @hidden
     * Angular2 Forms API method called by the view (formControlName) to register
     * the onTouched event handler that marks model (Control) as touched.
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @hidden
     * @return {?}
     */
    focusNext() {
        this._form.tabFocus(this);
    }
}
TextInput.decorators = [
    { type: Component, args: [{
                selector: 'ion-input,ion-textarea',
                template: '<input [(ngModel)]="_value" [type]="type" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" class="text-input" [ngClass]="\'text-input-\' + _mode" *ngIf="_type!==\'textarea\'"  #input>' +
                    '<textarea [(ngModel)]="_value" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" class="text-input" [ngClass]="\'text-input-\' + _mode" *ngIf="_type===\'textarea\'" #textarea></textarea>' +
                    '<input [type]="type" aria-hidden="true" next-input *ngIf="_useAssist">' +
                    '<button ion-button clear [hidden]="!clearInput" type="button" class="text-input-clear-icon" (click)="clearTextInput()" (mousedown)="clearTextInput()"></button>' +
                    '<div (touchstart)="pointerStart($event)" (touchend)="pointerEnd($event)" (mousedown)="pointerStart($event)" (mouseup)="pointerEnd($event)" class="input-cover" tappable *ngIf="_useAssist"></div>',
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
TextInput.ctorParameters = () => [
    { type: Config, },
    { type: Platform, },
    { type: Form, },
    { type: App, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Content, decorators: [{ type: Optional },] },
    { type: Item, decorators: [{ type: Optional },] },
    { type: NavController, decorators: [{ type: Optional },] },
    { type: NgControl, decorators: [{ type: Optional },] },
    { type: DomController, },
];
TextInput.propDecorators = {
    'placeholder': [{ type: Input },],
    'clearInput': [{ type: Input },],
    'value': [{ type: Input },],
    'type': [{ type: Input },],
    'disabled': [{ type: Input },],
    'readonly': [{ type: Input },],
    'clearOnEdit': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'step': [{ type: Input },],
    '_nativeInput': [{ type: ViewChild, args: ['input', { read: NativeInput },] },],
    '_nativeTextarea': [{ type: ViewChild, args: ['textarea', { read: NativeInput },] },],
    '_nextInput': [{ type: ViewChild, args: [NextInput,] },],
    'blur': [{ type: Output },],
    'focus': [{ type: Output },],
};
function TextInput_tsickle_Closure_declarations() {
    /** @type {?} */
    TextInput.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TextInput.ctorParameters;
    /** @type {?} */
    TextInput.propDecorators;
    /** @type {?} */
    TextInput.prototype._autoComplete;
    /** @type {?} */
    TextInput.prototype._autoCorrect;
    /** @type {?} */
    TextInput.prototype._autoFocusAssist;
    /** @type {?} */
    TextInput.prototype._clearInput;
    /** @type {?} */
    TextInput.prototype._clearOnEdit;
    /** @type {?} */
    TextInput.prototype._coord;
    /** @type {?} */
    TextInput.prototype._didBlurAfterEdit;
    /** @type {?} */
    TextInput.prototype._disabled;
    /** @type {?} */
    TextInput.prototype._readonly;
    /** @type {?} */
    TextInput.prototype._isTouch;
    /** @type {?} */
    TextInput.prototype._keyboardHeight;
    /** @type {?} */
    TextInput.prototype._min;
    /** @type {?} */
    TextInput.prototype._max;
    /** @type {?} */
    TextInput.prototype._step;
    /** @type {?} */
    TextInput.prototype._native;
    /** @type {?} */
    TextInput.prototype._nav;
    /** @type {?} */
    TextInput.prototype._scrollStart;
    /** @type {?} */
    TextInput.prototype._scrollEnd;
    /** @type {?} */
    TextInput.prototype._type;
    /** @type {?} */
    TextInput.prototype._useAssist;
    /** @type {?} */
    TextInput.prototype._usePadding;
    /** @type {?} */
    TextInput.prototype._value;
    /**
     * @hidden
     * @type {?}
     */
    TextInput.prototype.inputControl;
    /**
     * \@input {string} Instructional text that shows before the input has a value.
     * @type {?}
     */
    TextInput.prototype.placeholder;
    /**
     * \@output {event} Emitted when the input no longer has focus.
     * @type {?}
     */
    TextInput.prototype.blur;
    /**
     * \@output {event} Emitted when the input has focus.
     * @type {?}
     */
    TextInput.prototype.focus;
    /** @type {?} */
    TextInput.prototype._plt;
    /** @type {?} */
    TextInput.prototype._form;
    /** @type {?} */
    TextInput.prototype._app;
    /** @type {?} */
    TextInput.prototype._content;
    /** @type {?} */
    TextInput.prototype._item;
    /** @type {?} */
    TextInput.prototype.ngControl;
    /** @type {?} */
    TextInput.prototype._dom;
}
/**
 * \@name TextArea
 * \@description
 *
 * `ion-textarea` is used for multi-line text inputs. Ionic still
 * uses an actual `<textarea>` HTML element within the component;
 * however, with Ionic wrapping the native HTML text area element, Ionic
 * is able to better handle the user experience and interactivity.
 *
 * Note that `<ion-textarea>` must load its value from the `value` or
 * `[(ngModel)]` attribute. Unlike the native `<textarea>` element,
 * `<ion-textarea>` does not support loading its value from the
 * textarea's inner content.
 *
 * When requiring only a single-line text input, we recommend using
 * `<ion-input>` instead.
 *
 * \@usage
 * ```html
 *  <ion-item>
 *    <ion-label>Comments</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label stacked>Message</ion-label>
 *    <ion-textarea [(ngModel)]="msg"></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label floating>Description</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 * <ion-item>
 *    <ion-label>Long Description</ion-label>
 *    <ion-textarea rows="6" placeholder="enter long description here..."></ion-textarea>
 *  </ion-item>
 * ```
 *
 * \@demo /docs/demos/src/textarea/
 */
const SCROLL_ASSIST_SPEED = 0.3;
const /** @type {?} */ TEXTAREA = 'textarea';
const /** @type {?} */ TEXT_TYPE_REGEX = /password|email|number|search|tel|url|date|month|time|week/;
/**
 * @hidden
 * @param {?} inputOffsetTop
 * @param {?} inputOffsetHeight
 * @param {?} scrollViewDimensions
 * @param {?} keyboardHeight
 * @param {?} plaformHeight
 * @return {?}
 */
export function getScrollData(inputOffsetTop, inputOffsetHeight, scrollViewDimensions, keyboardHeight, plaformHeight) {
    // compute input's Y values relative to the body
    let /** @type {?} */ inputTop = (inputOffsetTop + scrollViewDimensions.contentTop - scrollViewDimensions.scrollTop);
    let /** @type {?} */ inputBottom = (inputTop + inputOffsetHeight);
    // compute the safe area which is the viewable content area when the soft keyboard is up
    let /** @type {?} */ safeAreaTop = scrollViewDimensions.contentTop;
    let /** @type {?} */ safeAreaHeight = (plaformHeight - keyboardHeight - safeAreaTop) / 2;
    let /** @type {?} */ safeAreaBottom = safeAreaTop + safeAreaHeight;
    // figure out if each edge of teh input is within the safe area
    let /** @type {?} */ inputTopWithinSafeArea = (inputTop >= safeAreaTop && inputTop <= safeAreaBottom);
    let /** @type {?} */ inputTopAboveSafeArea = (inputTop < safeAreaTop);
    let /** @type {?} */ inputTopBelowSafeArea = (inputTop > safeAreaBottom);
    let /** @type {?} */ inputBottomWithinSafeArea = (inputBottom >= safeAreaTop && inputBottom <= safeAreaBottom);
    let /** @type {?} */ inputBottomBelowSafeArea = (inputBottom > safeAreaBottom);
    /*
    Text Input Scroll To Scenarios
    ---------------------------------------
    1) Input top within safe area, bottom within safe area
    2) Input top within safe area, bottom below safe area, room to scroll
    3) Input top above safe area, bottom within safe area, room to scroll
    4) Input top below safe area, no room to scroll, input smaller than safe area
    5) Input top within safe area, bottom below safe area, no room to scroll, input smaller than safe area
    6) Input top within safe area, bottom below safe area, no room to scroll, input larger than safe area
    7) Input top below safe area, no room to scroll, input larger than safe area
    */
    const /** @type {?} */ scrollData = {
        scrollAmount: 0,
        scrollTo: 0,
        scrollPadding: 0,
        inputSafeY: 0
    };
    if (inputTopWithinSafeArea && inputBottomWithinSafeArea) {
        // Input top within safe area, bottom within safe area
        // no need to scroll to a position, it's good as-is
        return scrollData;
    }
    // looks like we'll have to do some auto-scrolling
    if (inputTopBelowSafeArea || inputBottomBelowSafeArea || inputTopAboveSafeArea) {
        // Input top or bottom below safe area
        // auto scroll the input up so at least the top of it shows
        if (safeAreaHeight > inputOffsetHeight) {
            // safe area height is taller than the input height, so we
            // can bring up the input just enough to show the input bottom
            scrollData.scrollAmount = Math.round(safeAreaBottom - inputBottom);
        }
        else {
            // safe area height is smaller than the input height, so we can
            // only scroll it up so the input top is at the top of the safe area
            // however the input bottom will be below the safe area
            scrollData.scrollAmount = Math.round(safeAreaTop - inputTop);
        }
        scrollData.inputSafeY = -(inputTop - safeAreaTop) + 4;
        if (inputTopAboveSafeArea && scrollData.scrollAmount > inputOffsetHeight) {
            // the input top is above the safe area and we're already scrolling it into place
            // don't let it scroll more than the height of the input
            scrollData.scrollAmount = inputOffsetHeight;
        }
    }
    // figure out where it should scroll to for the best position to the input
    scrollData.scrollTo = (scrollViewDimensions.scrollTop - scrollData.scrollAmount);
    // when auto-scrolling, there also needs to be enough
    // content padding at the bottom of the scroll view
    // always add scroll padding when a text input has focus
    // this allows for the content to scroll above of the keyboard
    // content behind the keyboard would be blank
    // some cases may not need it, but when jumping around it's best
    // to have the padding already rendered so there's no jank
    scrollData.scrollPadding = keyboardHeight;
    // var safeAreaEle: HTMLElement = (<any>window).safeAreaEle;
    // if (!safeAreaEle) {
    //   safeAreaEle = (<any>window).safeAreaEle  = document.createElement('div');
    //   safeAreaEle.style.cssText = 'position:absolute; padding:1px 5px; left:0; right:0; font-weight:bold; font-size:10px; font-family:Courier; text-align:right; background:rgba(0, 128, 0, 0.8); text-shadow:1px 1px white; pointer-events:none;';
    //   document.body.appendChild(safeAreaEle);
    // }
    // safeAreaEle.style.top = safeAreaTop + 'px';
    // safeAreaEle.style.height = safeAreaHeight + 'px';
    // safeAreaEle.innerHTML = `
    //   <div>scrollTo: ${scrollData.scrollTo}</div>
    //   <div>scrollAmount: ${scrollData.scrollAmount}</div>
    //   <div>scrollPadding: ${scrollData.scrollPadding}</div>
    //   <div>inputSafeY: ${scrollData.inputSafeY}</div>
    //   <div>scrollHeight: ${scrollViewDimensions.scrollHeight}</div>
    //   <div>scrollTop: ${scrollViewDimensions.scrollTop}</div>
    //   <div>contentHeight: ${scrollViewDimensions.contentHeight}</div>
    //   <div>plaformHeight: ${plaformHeight}</div>
    // `;
    return scrollData;
}
/**
 * @param {?} element
 * @param {?} control
 * @return {?}
 */
function setControlCss(element, control) {
    element.setElementClass('ng-untouched', control.untouched);
    element.setElementClass('ng-touched', control.touched);
    element.setElementClass('ng-pristine', control.pristine);
    element.setElementClass('ng-dirty', control.dirty);
    element.setElementClass('ng-valid', control.valid);
    element.setElementClass('ng-invalid', !control.valid);
}
/**
 * @param {?} distanceToScroll
 * @return {?}
 */
function getScrollAssistDuration(distanceToScroll) {
    distanceToScroll = Math.abs(distanceToScroll);
    let /** @type {?} */ duration = distanceToScroll / SCROLL_ASSIST_SPEED;
    return Math.min(400, Math.max(150, duration));
}
//# sourceMappingURL=input.js.map