import { Injectable } from '@angular/core';
import { removeArrayItem } from './util';
/**
 * @hidden
 */
export class Form {
    constructor() {
        this._focused = null;
        this._ids = -1;
        this._inputs = [];
    }
    /**
     * @param {?} input
     * @return {?}
     */
    register(input) {
        this._inputs.push(input);
    }
    /**
     * @param {?} input
     * @return {?}
     */
    deregister(input) {
        removeArrayItem(this._inputs, input);
        if (input === this._focused) {
            this._focused = null;
        }
    }
    /**
     * @param {?} input
     * @return {?}
     */
    setAsFocused(input) {
        this._focused = input;
    }
    /**
     * Focuses the next input element, if it exists.
     * @param {?} currentInput
     * @return {?}
     */
    tabFocus(currentInput) {
        let /** @type {?} */ index = this._inputs.indexOf(currentInput);
        if (index > -1 && (index + 1) < this._inputs.length) {
            let /** @type {?} */ nextInput = this._inputs[index + 1];
            if (nextInput !== this._focused) {
                (void 0) /* console.debug */;
                return nextInput.initFocus();
            }
        }
        index = this._inputs.indexOf(this._focused);
        if (index > 0) {
            let /** @type {?} */ previousInput = this._inputs[index - 1];
            if (previousInput) {
                (void 0) /* console.debug */;
                previousInput.initFocus();
            }
        }
    }
    /**
     * @return {?}
     */
    nextId() {
        return ++this._ids;
    }
}
Form.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Form.ctorParameters = () => [];
function Form_tsickle_Closure_declarations() {
    /** @type {?} */
    Form.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Form.ctorParameters;
    /** @type {?} */
    Form.prototype._focused;
    /** @type {?} */
    Form.prototype._ids;
    /** @type {?} */
    Form.prototype._inputs;
}
/**
 * @hidden
 * @abstract
 */
export class IonicTapInput {
    /**
     * @abstract
     * @return {?}
     */
    initFocus() { }
    /**
     * @abstract
     * @return {?}
     */
    checked() { }
    /**
     * @abstract
     * @param {?} val
     * @return {?}
     */
    checked(val) { }
    /**
     * @abstract
     * @return {?}
     */
    disabled() { }
    /**
     * @abstract
     * @param {?} val
     * @return {?}
     */
    disabled(val) { }
}
/**
 * @hidden
 * @abstract
 */
export class IonicFormInput {
    /**
     * @abstract
     * @return {?}
     */
    initFocus() { }
}
//# sourceMappingURL=form.js.map