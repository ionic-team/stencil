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
import { Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Input, HostListener, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActionSheet } from '../action-sheet/action-sheet';
import { Alert } from '../alert/alert';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { isCheckedProperty, isTrueProperty, deepCopy, deepEqual } from '../../util/util';
import { Item } from '../item/item';
import { NavController } from '../../navigation/nav-controller';
import { Option } from '../option/option';
export var /** @type {?} */ SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return Select; }),
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
        _this.ionCancel = new EventEmitter();
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
        var /** @type {?} */ selectOptions = deepCopy(this.selectOptions);
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
            overlay = new ActionSheet(this._app, selectOptions, this.config);
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
            overlay = new Alert(this._app, selectOptions, this.config);
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
            this._multi = isTrueProperty(val);
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
        return !deepEqual(this._value, val);
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
                    return isCheckedProperty(selectValue, option.value);
                });
                if (option.selected) {
                    _this._texts.push(option.text);
                }
            });
        }
        this._text = this._texts.join(', ');
    };
    return Select;
}(BaseInput));
export { Select };
Select.decorators = [
    { type: Component, args: [{
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
                providers: [SELECT_VALUE_ACCESSOR],
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
Select.ctorParameters = function () { return [
    { type: App, },
    { type: Form, },
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Item, decorators: [{ type: Optional },] },
    { type: NavController, decorators: [{ type: Optional },] },
]; };
Select.propDecorators = {
    'cancelText': [{ type: Input },],
    'okText': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'selectOptions': [{ type: Input },],
    'interface': [{ type: Input },],
    'selectedText': [{ type: Input },],
    'ionCancel': [{ type: Output },],
    '_click': [{ type: HostListener, args: ['click', ['$event'],] },],
    '_keyup': [{ type: HostListener, args: ['keyup.space',] },],
    'multiple': [{ type: Input },],
    'options': [{ type: ContentChildren, args: [Option,] },],
};
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
//# sourceMappingURL=select.js.map