import { ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input, Optional, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
export const /** @type {?} */ CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Checkbox),
    multi: true
};
/**
 * \@name Checkbox
 * \@module ionic
 *
 * \@description
 * The Checkbox is a simple component styled based on the mode. It can be
 * placed in an `ion-item` or used as a stand-alone checkbox.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 *
 * \@usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-checkbox [(ngModel)]="pepperoni"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-checkbox [(ngModel)]="sausage" disabled="true"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * \@demo /docs/demos/src/checkbox/
 * @see {\@link /docs/components#checkbox Checkbox Component Docs}
 */
export class Checkbox extends BaseInput {
    /**
     * @param {?} config
     * @param {?} form
     * @param {?} item
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _cd
     */
    constructor(config, form, item, elementRef, renderer, _cd) {
        super(config, elementRef, renderer, 'checkbox', false, form, item, null);
        this._cd = _cd;
    }
    /**
     * \@input {boolean} If true, the element is selected.
     * @return {?}
     */
    get checked() {
        return this.value;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set checked(val) {
        this.value = val;
    }
    /**
     * @hidden
     * @return {?}
     */
    initFocus() {
        this._elementRef.nativeElement.querySelector('button').focus();
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    _click(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.value = !this.value;
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _inputNormalize(val) {
        return isTrueProperty(val);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _inputCheckHasValue(val) {
        this._item && this._item.setElementClass('item-checkbox-checked', val);
    }
}
Checkbox.decorators = [
    { type: Component, args: [{
                selector: 'ion-checkbox',
                template: '<div class="checkbox-icon" [class.checkbox-checked]="_value">' +
                    '<div class="checkbox-inner"></div>' +
                    '</div>' +
                    '<button role="checkbox" ' +
                    'type="button" ' +
                    'ion-button="item-cover" ' +
                    '[id]="id" ' +
                    '[attr.aria-checked]="_value" ' +
                    '[attr.aria-labelledby]="_labelId" ' +
                    '[attr.aria-disabled]="_disabled" ' +
                    'class="item-cover"> ' +
                    '</button>',
                host: {
                    '[class.checkbox-disabled]': '_disabled'
                },
                providers: [CHECKBOX_VALUE_ACCESSOR],
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
Checkbox.ctorParameters = () => [
    { type: Config, },
    { type: Form, },
    { type: Item, decorators: [{ type: Optional },] },
    { type: ElementRef, },
    { type: Renderer, },
    { type: ChangeDetectorRef, },
];
Checkbox.propDecorators = {
    'checked': [{ type: Input },],
    '_click': [{ type: HostListener, args: ['click', ['$event'],] },],
};
function Checkbox_tsickle_Closure_declarations() {
    /** @type {?} */
    Checkbox.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Checkbox.ctorParameters;
    /** @type {?} */
    Checkbox.propDecorators;
    /** @type {?} */
    Checkbox.prototype._cd;
}
//# sourceMappingURL=checkbox.js.map