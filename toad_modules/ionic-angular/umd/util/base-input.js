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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./util", "../components/ion", "./debouncer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("./util");
    var ion_1 = require("../components/ion");
    var debouncer_1 = require("./debouncer");
    var BaseInput = (function (_super) {
        __extends(BaseInput, _super);
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
        function BaseInput(config, elementRef, renderer, name, _defaultValue, _form, _item, ngControl) {
            var _this = _super.call(this, config, elementRef, renderer, name) || this;
            _this._defaultValue = _defaultValue;
            _this._form = _form;
            _this._item = _item;
            _this._isFocus = false;
            _this._disabled = false;
            _this._debouncer = new debouncer_1.TimeoutDebouncer(0);
            _this._init = false;
            /**
             * \@output {Range} Emitted when the range selector drag starts.
             */
            _this.ionFocus = new core_1.EventEmitter();
            /**
             * \@output {Range} Emitted when the range value changes.
             */
            _this.ionChange = new core_1.EventEmitter();
            /**
             * \@output {Range} Emitted when the range selector drag ends.
             */
            _this.ionBlur = new core_1.EventEmitter();
            _form && _form.register(_this);
            _this._value = util_1.deepCopy(_this._defaultValue);
            if (_item) {
                _this.id = name + '-' + _item.registerInput(name);
                _this._labelId = 'lbl-' + _item.id;
                _this._item.setElementClass('item-' + name, true);
            }
            // If the user passed a ngControl we need to set the valueAccessor
            if (ngControl) {
                ngControl.valueAccessor = _this;
            }
            return _this;
        }
        Object.defineProperty(BaseInput.prototype, "disabled", {
            /**
             * \@input {boolean} If true, the user cannot interact with this element.
             * @return {?}
             */
            get: function () {
                return this._disabled;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this.setDisabledState(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseInput.prototype, "value", {
            /**
             * @return {?}
             */
            get: function () {
                return this._value;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                if (this._writeValue(val)) {
                    this.onChange();
                    this._fireIonChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype.setValue = function (val) {
            this.value = val;
        };
        /**
         * @hidden
         * @param {?} isDisabled
         * @return {?}
         */
        BaseInput.prototype.setDisabledState = function (isDisabled) {
            this._disabled = util_1.isTrueProperty(isDisabled);
            this._item && this._item.setElementClass("item-" + this._componentName + "-disabled", isDisabled);
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype.writeValue = function (val) {
            if (this._writeValue(val)) {
                this._fireIonChange();
            }
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype._writeValue = function (val) {
            (void 0) /* assert */;
            if (util_1.isUndefined(val)) {
                return false;
            }
            var /** @type {?} */ normalized = (val === null)
                ? util_1.deepCopy(this._defaultValue)
                : this._inputNormalize(val);
            var /** @type {?} */ notUpdate = util_1.isUndefined(normalized) || !this._inputShouldChange(normalized);
            if (notUpdate) {
                return false;
            }
            (void 0) /* console.debug */;
            this._value = normalized;
            this._inputCheckHasValue(normalized);
            this._inputUpdated();
            return true;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._fireIonChange = function () {
            var _this = this;
            if (this._init) {
                this._debouncer.debounce(function () {
                    (void 0) /* assert */;
                    _this.ionChange.emit(_this);
                });
            }
        };
        /**
         * @hidden
         * @param {?} fn
         * @return {?}
         */
        BaseInput.prototype.registerOnChange = function (fn) {
            this._onChanged = fn;
        };
        /**
         * @hidden
         * @param {?} fn
         * @return {?}
         */
        BaseInput.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._initialize = function () {
            if (this._init) {
                (void 0) /* assert */;
                return;
            }
            this._init = true;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._fireFocus = function () {
            if (this._isFocus) {
                return;
            }
            (void 0) /* assert */;
            this._isFocus = true;
            this.ionFocus.emit(this);
            this._inputUpdated();
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._fireBlur = function () {
            if (!this._isFocus) {
                return;
            }
            (void 0) /* assert */;
            this._isFocus = false;
            this.ionBlur.emit(this);
            this._inputUpdated();
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.onChange = function () {
            this._onChanged && this._onChanged(this._value);
            this._onTouched && this._onTouched();
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.isFocus = function () {
            return this._isFocus;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.ngOnDestroy = function () {
            this._form && this._form.deregister(this);
            this._init = false;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.ngAfterViewInit = function () {
            this._initialize();
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype._inputCheckHasValue = function (val) {
            if (!this._item) {
                return;
            }
            var /** @type {?} */ hasValue = util_1.isArray(val)
                ? val.length > 0
                : util_1.isPresent(val);
            this._item.setElementClass('input-has-value', hasValue);
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.initFocus = function () { };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype._inputNormalize = function (val) {
            return val;
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype._inputShouldChange = function (val) {
            return this._value !== val;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._inputUpdated = function () { };
        return BaseInput;
    }(ion_1.Ion));
    BaseInput.propDecorators = {
        'ionFocus': [{ type: core_1.Output },],
        'ionChange': [{ type: core_1.Output },],
        'ionBlur': [{ type: core_1.Output },],
        'disabled': [{ type: core_1.Input },],
    };
    exports.BaseInput = BaseInput;
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
});
//# sourceMappingURL=base-input.js.map