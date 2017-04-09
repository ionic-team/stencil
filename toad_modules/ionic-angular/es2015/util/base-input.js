import { EventEmitter, Input, Output } from '@angular/core';
import { isPresent, isUndefined, isArray, isTrueProperty, deepCopy } from './util';
import { Ion } from '../components/ion';
import { TimeoutDebouncer } from './debouncer';
export class BaseInput extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} name
     * @param {?} _defaultValue
     * @param {?} _form
     * @param {?} _item
     * @param {?} ngControl
     */
    constructor(config, elementRef, renderer, name, _defaultValue, _form, _item, ngControl) {
        super(config, elementRef, renderer, name);
        this._defaultValue = _defaultValue;
        this._form = _form;
        this._item = _item;
        this._isFocus = false;
        this._disabled = false;
        this._debouncer = new TimeoutDebouncer(0);
        this._init = false;
        /**
         * \@output {Range} Emitted when the range selector drag starts.
         */
        this.ionFocus = new EventEmitter();
        /**
         * \@output {Range} Emitted when the range value changes.
         */
        this.ionChange = new EventEmitter();
        /**
         * \@output {Range} Emitted when the range selector drag ends.
         */
        this.ionBlur = new EventEmitter();
        _form && _form.register(this);
        this._value = deepCopy(this._defaultValue);
        if (_item) {
            this.id = name + '-' + _item.registerInput(name);
            this._labelId = 'lbl-' + _item.id;
            this._item.setElementClass('item-' + name, true);
        }
        // If the user passed a ngControl we need to set the valueAccessor
        if (ngControl) {
            ngControl.valueAccessor = this;
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
        this.setDisabledState(val);
    }
    /**
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
        if (this._writeValue(val)) {
            this.onChange();
            this._fireIonChange();
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setValue(val) {
        this.value = val;
    }
    /**
     * @hidden
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._disabled = isTrueProperty(isDisabled);
        this._item && this._item.setElementClass(`item-${this._componentName}-disabled`, isDisabled);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    writeValue(val) {
        if (this._writeValue(val)) {
            this._fireIonChange();
        }
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _writeValue(val) {
        (void 0) /* assert */;
        if (isUndefined(val)) {
            return false;
        }
        const /** @type {?} */ normalized = (val === null)
            ? deepCopy(this._defaultValue)
            : this._inputNormalize(val);
        const /** @type {?} */ notUpdate = isUndefined(normalized) || !this._inputShouldChange(normalized);
        if (notUpdate) {
            return false;
        }
        (void 0) /* console.debug */;
        this._value = normalized;
        this._inputCheckHasValue(normalized);
        this._inputUpdated();
        return true;
    }
    /**
     * @hidden
     * @return {?}
     */
    _fireIonChange() {
        if (this._init) {
            this._debouncer.debounce(() => {
                (void 0) /* assert */;
                this.ionChange.emit(this);
            });
        }
    }
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChanged = fn;
    }
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @hidden
     * @return {?}
     */
    _initialize() {
        if (this._init) {
            (void 0) /* assert */;
            return;
        }
        this._init = true;
    }
    /**
     * @hidden
     * @return {?}
     */
    _fireFocus() {
        if (this._isFocus) {
            return;
        }
        (void 0) /* assert */;
        this._isFocus = true;
        this.ionFocus.emit(this);
        this._inputUpdated();
    }
    /**
     * @hidden
     * @return {?}
     */
    _fireBlur() {
        if (!this._isFocus) {
            return;
        }
        (void 0) /* assert */;
        this._isFocus = false;
        this.ionBlur.emit(this);
        this._inputUpdated();
    }
    /**
     * @hidden
     * @return {?}
     */
    onChange() {
        this._onChanged && this._onChanged(this._value);
        this._onTouched && this._onTouched();
    }
    /**
     * @hidden
     * @return {?}
     */
    isFocus() {
        return this._isFocus;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        this._form && this._form.deregister(this);
        this._init = false;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngAfterViewInit() {
        this._initialize();
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _inputCheckHasValue(val) {
        if (!this._item) {
            return;
        }
        const /** @type {?} */ hasValue = isArray(val)
            ? val.length > 0
            : isPresent(val);
        this._item.setElementClass('input-has-value', hasValue);
    }
    /**
     * @hidden
     * @return {?}
     */
    initFocus() { }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _inputNormalize(val) {
        return val;
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _inputShouldChange(val) {
        return this._value !== val;
    }
    /**
     * @hidden
     * @return {?}
     */
    _inputUpdated() { }
}
BaseInput.propDecorators = {
    'ionFocus': [{ type: Output },],
    'ionChange': [{ type: Output },],
    'ionBlur': [{ type: Output },],
    'disabled': [{ type: Input },],
};
function BaseInput_tsickle_Closure_declarations() {
    /** @type {?} */
    BaseInput.propDecorators;
    /** @type {?} */
    BaseInput.prototype._value;
    /** @type {?} */
    BaseInput.prototype._onChanged;
    /** @type {?} */
    BaseInput.prototype._onTouched;
    /** @type {?} */
    BaseInput.prototype._isFocus;
    /** @type {?} */
    BaseInput.prototype._labelId;
    /** @type {?} */
    BaseInput.prototype._disabled;
    /** @type {?} */
    BaseInput.prototype._debouncer;
    /** @type {?} */
    BaseInput.prototype._init;
    /** @type {?} */
    BaseInput.prototype.id;
    /**
     * \@output {Range} Emitted when the range selector drag starts.
     * @type {?}
     */
    BaseInput.prototype.ionFocus;
    /**
     * \@output {Range} Emitted when the range value changes.
     * @type {?}
     */
    BaseInput.prototype.ionChange;
    /**
     * \@output {Range} Emitted when the range selector drag ends.
     * @type {?}
     */
    BaseInput.prototype.ionBlur;
    /** @type {?} */
    BaseInput.prototype._defaultValue;
    /** @type {?} */
    BaseInput.prototype._form;
    /** @type {?} */
    BaseInput.prototype._item;
}
//# sourceMappingURL=base-input.js.map