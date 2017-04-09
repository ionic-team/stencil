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
        define(["require", "exports", "@angular/core", "@angular/forms", "../action-sheet/action-sheet", "../alert/alert", "../app/app", "../../config/config", "../../util/form", "../../util/base-input", "../../util/util", "../item/item", "../../navigation/nav-controller", "../option/option"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var forms_1 = require("@angular/forms");
    var action_sheet_1 = require("../action-sheet/action-sheet");
    var alert_1 = require("../alert/alert");
    var app_1 = require("../app/app");
    var config_1 = require("../../config/config");
    var form_1 = require("../../util/form");
    var base_input_1 = require("../../util/base-input");
    var util_1 = require("../../util/util");
    var item_1 = require("../item/item");
    var nav_controller_1 = require("../../navigation/nav-controller");
    var option_1 = require("../option/option");
    exports.SELECT_VALUE_ACCESSOR = {
        provide: forms_1.NG_VALUE_ACCESSOR,
        useExisting: core_1.forwardRef(function () { return Select; }),
        multi: true
    };
    /**
     * \@name Select
     * \@description
     * The `ion-select` component is similar to an HTML `<select>` element, however,
     * Ionic's select component makes it easier for users to sort through and select
     * the preferred option or options. When users tap the select component, a
     * dialog will appear with all of the options in a large, easy to select list
     * for users.
     *
     * The select component takes child `ion-option` components. If `ion-option` is not
     * given a `value` attribute then it will use its text as the value.
     *
     * If `ngModel` is bound to `ion-select`, the selected value will be based on the
     * bound value of the model. Otherwise, the `selected` attribute can be used on
     * `ion-option` components.
     *
     * ### Interfaces
     *
     * By default, the `ion-select` uses the {\@link ../../alert/AlertController AlertController API}
     * to open up the overlay of options in an alert. The interface can be changed to use the
     * {\@link ../../action-sheet/ActionSheetController ActionSheetController API} by passing
     * `action-sheet` to the `interface` property. Read the other sections for the limitations of the
     * action sheet interface.
     *
     * ### Single Value: Radio Buttons
     *
     * The standard `ion-select` component allows the user to select only one
     * option. When selecting only one option the alert interface presents users with
     * a radio button styled list of options. The action sheet interface can only be
     * used with a single value select. If the number of options exceed 6, it will
     * use the `alert` interface even if `action-sheet` is passed. The `ion-select`
     * component's value receives the value of the selected option's value.
     *
     * ```html
     * <ion-item>
     *   <ion-label>Gender</ion-label>
     *   <ion-select [(ngModel)]="gender">
     *     <ion-option value="f">Female</ion-option>
     *     <ion-option value="m">Male</ion-option>
     *   </ion-select>
     * </ion-item>
     * ```
     *
     * ### Multiple Value: Checkboxes
     *
     * By adding the `multiple="true"` attribute to `ion-select`, users are able
     * to select multiple options. When multiple options can be selected, the alert
     * overlay presents users with a checkbox styled list of options. The
     * `ion-select multiple="true"` component's value receives an array of all the
     * selected option values. In the example below, because each option is not given
     * a `value`, then it'll use its text as the value instead.
     *
     * Note: the action sheet interface will not work with a multi-value select.
     *
     * ```html
     * <ion-item>
     *   <ion-label>Toppings</ion-label>
     *   <ion-select [(ngModel)]="toppings" multiple="true">
     *     <ion-option>Bacon</ion-option>
     *     <ion-option>Black Olives</ion-option>
     *     <ion-option>Extra Cheese</ion-option>
     *     <ion-option>Mushrooms</ion-option>
     *     <ion-option>Pepperoni</ion-option>
     *     <ion-option>Sausage</ion-option>
     *   </ion-select>
     * </ion-item>
     * ```
     *
     * ### Select Buttons
     * By default, the two buttons read `Cancel` and `OK`. Each button's text
     * can be customized using the `cancelText` and `okText` attributes:
     *
     * ```html
     * <ion-select okText="Okay" cancelText="Dismiss">
     *   ...
     * </ion-select>
     * ```
     *
     * The action sheet interface does not have an `OK` button, clicking
     * on any of the options will automatically close the overlay and select
     * that value.
     *
     * ### Select Options
     *
     * Since `ion-select` uses the `Alert` and `Action Sheet` interfaces, options can be
     * passed to these components through the `selectOptions` property. This can be used
     * to pass a custom title, subtitle, css class, and more. See the
     * {\@link ../../alert/AlertController/#create AlertController API docs} and
     * {\@link ../../action-sheet/ActionSheetController/#create ActionSheetController API docs}
     * for the properties that each interface accepts.
     *
     * ```html
     * <ion-select [selectOptions]="selectOptions">
     *   ...
     * </ion-select>
     * ```
     *
     * ```ts
     * this.selectOptions = {
     *   title: 'Pizza Toppings',
     *   subTitle: 'Select your toppings'
     * };
     * ```
     *
     * \@demo /docs/demos/src/select/
     */
    var Select = (function (_super) {
        __extends(Select, _super);
        /**
         * @param {?} _app
         * @param {?} form
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} item
         * @param {?} _nav
         */
        function Select(_app, form, config, elementRef, renderer, item, _nav) {
            var _this = _super.call(this, config, elementRef, renderer, 'select', [], form, item, null) || this;
            _this._app = _app;
            _this.config = config;
            _this._nav = _nav;
            _this._multi = false;
            _this._texts = [];
            _this._text = '';
            /**
             * \@input {string} The text to display on the cancel button. Default: `Cancel`.
             */
            _this.cancelText = 'Cancel';
            /**
             * \@input {string} The text to display on the ok button. Default: `OK`.
             */
            _this.okText = 'OK';
            /**
             * \@input {any} Any additional options that the `alert` or `action-sheet` interface can take.
             * See the [AlertController API docs](../../alert/AlertController/#create) and the
             * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) for the
             * create options for each interface.
             */
            _this.selectOptions = {};
            /**
             * \@input {string} The interface the select should use: `action-sheet` or `alert`. Default: `alert`.
             */
            _this.interface = '';
            /**
             * \@input {string} The text to display instead of the selected option's value.
             */
            _this.selectedText = '';
            /**
             * \@output {any} Emitted when the selection was cancelled.
             */
            _this.ionCancel = new core_1.EventEmitter();
            return _this;
        }
        /**
         * @return {?}
         */
        Select.prototype.ngAfterContentInit = function () {
            this._inputUpdated();
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        Select.prototype._click = function (ev) {
            if (ev.detail === 0) {
                // do not continue if the click event came from a form submit
                return;
            }
            ev.preventDefault();
            ev.stopPropagation();
            this.open();
        };
        /**
         * @return {?}
         */
        Select.prototype._keyup = function () {
            this.open();
        };
        /**
         * Open the select interface.
         * @return {?}
         */
        Select.prototype.open = function () {
            var _this = this;
            if (this.isFocus() || this._disabled) {
                return;
            }
            (void 0) /* console.debug */;
            // the user may have assigned some options specifically for the alert
            var /** @type {?} */ selectOptions = util_1.deepCopy(this.selectOptions);
            // make sure their buttons array is removed from the options
            // and we create a new array for the alert's two buttons
            selectOptions.buttons = [{
                    text: this.cancelText,
                    role: 'cancel',
                    handler: function () {
                        _this.ionCancel.emit(_this);
                    }
                }];
            // if the selectOptions didn't provide a title then use the label's text
            if (!selectOptions.title && this._item) {
                selectOptions.title = this._item.getLabelText();
            }
            var /** @type {?} */ options = this._options.toArray();
            if (this.interface === 'action-sheet' && options.length > 6) {
                console.warn('Interface cannot be "action-sheet" with more than 6 options. Using the "alert" interface.');
                this.interface = 'alert';
            }
            if (this.interface === 'action-sheet' && this._multi) {
                console.warn('Interface cannot be "action-sheet" with a multi-value select. Using the "alert" interface.');
                this.interface = 'alert';
            }
            var /** @type {?} */ overlay;
            if (this.interface === 'action-sheet') {
                selectOptions.buttons = selectOptions.buttons.concat(options.map(function (input) {
                    return {
                        role: (input.selected ? 'selected' : ''),
                        text: input.text,
                        handler: function () {
                            _this.value = input.value;
                            input.ionSelect.emit(input.value);
                        }
                    };
                }));
                var /** @type {?} */ selectCssClass = 'select-action-sheet';
                // If the user passed a cssClass for the select, add it
                selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';
                selectOptions.cssClass = selectCssClass;
                overlay = new action_sheet_1.ActionSheet(this._app, selectOptions, this.config);
            }
            else {
                // default to use the alert interface
                this.interface = 'alert';
                // user cannot provide inputs from selectOptions
                // alert inputs must be created by ionic from ion-options
                selectOptions.inputs = this._options.map(function (input) {
                    return {
                        type: (_this._multi ? 'checkbox' : 'radio'),
                        label: input.text,
                        value: input.value,
                        checked: input.selected,
                        disabled: input.disabled,
                        handler: function (selectedOption) {
                            // Only emit the select event if it is being checked
                            // For multi selects this won't emit when unchecking
                            if (selectedOption.checked) {
                                input.ionSelect.emit(input.value);
                            }
                        }
                    };
                });
                var /** @type {?} */ selectCssClass = 'select-alert';
                // create the alert instance from our built up selectOptions
                overlay = new alert_1.Alert(this._app, selectOptions, this.config);
                if (this._multi) {
                    // use checkboxes
                    selectCssClass += ' multiple-select-alert';
                }
                else {
                    // use radio buttons
                    selectCssClass += ' single-select-alert';
                }
                // If the user passed a cssClass for the select, add it
                selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';
                overlay.setCssClass(selectCssClass);
                overlay.addButton({
                    text: this.okText,
                    handler: function (selectedValues) { return _this.value = selectedValues; }
                });
            }
            overlay.present(selectOptions);
            this._fireFocus();
            overlay.onDidDismiss(function () {
                _this._fireBlur();
            });
        };
        Object.defineProperty(Select.prototype, "multiple", {
            /**
             * \@input {boolean} If true, the element can accept multiple values.
             * @return {?}
             */
            get: function () {
                return this._multi;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._multi = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Select.prototype, "text", {
            /**
             * @hidden
             * @return {?}
             */
            get: function () {
                return (this._multi ? this._texts : this._texts.join());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Select.prototype, "options", {
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._options = val;
                if (this._value.length === 0) {
                    // there are no values set at this point
                    // so check to see who should be selected
                    // we use writeValue() because we don't want to update ngModel
                    this.writeValue(val.filter(function (o) { return o.selected; }).map(function (o) { return o.value; }));
                }
                this._inputUpdated();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} val
         * @return {?}
         */
        Select.prototype._inputNormalize = function (val) {
            if (Array.isArray(val)) {
                return val;
            }
            return [val + ''];
        };
        /**
         * @param {?} val
         * @return {?}
         */
        Select.prototype._inputShouldChange = function (val) {
            return !util_1.deepEqual(this._value, val);
        };
        /**
         * @hidden
         * @return {?}
         */
        Select.prototype._inputUpdated = function () {
            var _this = this;
            this._texts.length = 0;
            if (this._options) {
                this._options.forEach(function (option) {
                    // check this option if the option's value is in the values array
                    option.selected = _this._value.some(function (selectValue) {
                        return util_1.isCheckedProperty(selectValue, option.value);
                    });
                    if (option.selected) {
                        _this._texts.push(option.text);
                    }
                });
            }
            this._text = this._texts.join(', ');
        };
        return Select;
    }(base_input_1.BaseInput));
    Select.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-select',
                    template: '<div *ngIf="!_text" class="select-placeholder select-text">{{placeholder}}</div>' +
                        '<div *ngIf="_text" class="select-text">{{selectedText || _text}}</div>' +
                        '<div class="select-icon">' +
                        '<div class="select-icon-inner"></div>' +
                        '</div>' +
                        '<button aria-haspopup="true" ' +
                        '[id]="id" ' +
                        'ion-button="item-cover" ' +
                        '[attr.aria-labelledby]="_labelId" ' +
                        '[attr.aria-disabled]="_disabled" ' +
                        'class="item-cover">' +
                        '</button>',
                    host: {
                        '[class.select-disabled]': '_disabled'
                    },
                    providers: [exports.SELECT_VALUE_ACCESSOR],
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    Select.ctorParameters = function () { return [
        { type: app_1.App, },
        { type: form_1.Form, },
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: item_1.Item, decorators: [{ type: core_1.Optional },] },
        { type: nav_controller_1.NavController, decorators: [{ type: core_1.Optional },] },
    ]; };
    Select.propDecorators = {
        'cancelText': [{ type: core_1.Input },],
        'okText': [{ type: core_1.Input },],
        'placeholder': [{ type: core_1.Input },],
        'selectOptions': [{ type: core_1.Input },],
        'interface': [{ type: core_1.Input },],
        'selectedText': [{ type: core_1.Input },],
        'ionCancel': [{ type: core_1.Output },],
        '_click': [{ type: core_1.HostListener, args: ['click', ['$event'],] },],
        '_keyup': [{ type: core_1.HostListener, args: ['keyup.space',] },],
        'multiple': [{ type: core_1.Input },],
        'options': [{ type: core_1.ContentChildren, args: [option_1.Option,] },],
    };
    exports.Select = Select;
    function Select_tsickle_Closure_declarations() {
        /** @type {?} */
        Select.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Select.ctorParameters;
        /** @type {?} */
        Select.propDecorators;
        /** @type {?} */
        Select.prototype._multi;
        /** @type {?} */
        Select.prototype._options;
        /** @type {?} */
        Select.prototype._texts;
        /** @type {?} */
        Select.prototype._text;
        /**
         * \@input {string} The text to display on the cancel button. Default: `Cancel`.
         * @type {?}
         */
        Select.prototype.cancelText;
        /**
         * \@input {string} The text to display on the ok button. Default: `OK`.
         * @type {?}
         */
        Select.prototype.okText;
        /**
         * \@input {string} The text to display when the select is empty.
         * @type {?}
         */
        Select.prototype.placeholder;
        /**
         * \@input {any} Any additional options that the `alert` or `action-sheet` interface can take.
         * See the [AlertController API docs](../../alert/AlertController/#create) and the
         * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) for the
         * create options for each interface.
         * @type {?}
         */
        Select.prototype.selectOptions;
        /**
         * \@input {string} The interface the select should use: `action-sheet` or `alert`. Default: `alert`.
         * @type {?}
         */
        Select.prototype.interface;
        /**
         * \@input {string} The text to display instead of the selected option's value.
         * @type {?}
         */
        Select.prototype.selectedText;
        /**
         * \@output {any} Emitted when the selection was cancelled.
         * @type {?}
         */
        Select.prototype.ionCancel;
        /** @type {?} */
        Select.prototype._app;
        /** @type {?} */
        Select.prototype.config;
        /** @type {?} */
        Select.prototype._nav;
    }
});
//# sourceMappingURL=select.js.map