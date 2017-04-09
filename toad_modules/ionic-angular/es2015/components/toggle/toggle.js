import { NgZone, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input, Optional, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { GestureController } from '../../gestures/gesture-controller';
import { Haptic } from '../../tap-click/haptic';
import { isTrueProperty } from '../../util/util';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { KEY_ENTER, KEY_SPACE } from '../../platform/key';
import { Platform } from '../../platform/platform';
import { ToggleGesture } from './toggle-gesture';
export const /** @type {?} */ TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Toggle),
    multi: true
};
/**
 * \@name Toggle
 * \@description
 * A toggle technically is the same thing as an HTML checkbox input,
 * except it looks different and is easier to use on a touch device.
 * Toggles can also have colors assigned to them, by adding any color
 * attribute.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 * \@usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-toggle [(ngModel)]="pepperoni"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-toggle [(ngModel)]="sausage" disabled="true"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-toggle [(ngModel)]="mushrooms"></ion-toggle>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * \@demo /docs/demos/src/toggle/
 * @see {\@link /docs/components#toggle Toggle Component Docs}
 */
export class Toggle extends BaseInput {
    /**
     * @param {?} form
     * @param {?} config
     * @param {?} _plt
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _haptic
     * @param {?} item
     * @param {?} _gestureCtrl
     * @param {?} _domCtrl
     * @param {?} _cd
     * @param {?} _zone
     */
    constructor(form, config, _plt, elementRef, renderer, _haptic, item, _gestureCtrl, _domCtrl, _cd, _zone) {
        super(config, elementRef, renderer, 'toggle', false, form, item, null);
        this._plt = _plt;
        this._haptic = _haptic;
        this._gestureCtrl = _gestureCtrl;
        this._domCtrl = _domCtrl;
        this._cd = _cd;
        this._zone = _zone;
        this._activated = false;
        this._msPrv = 0;
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
    ngAfterViewInit() {
        this._initialize();
        this._gesture = new ToggleGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
        this._gesture.listen();
    }
    /**
     * @hidden
     * @return {?}
     */
    _inputCheckHasValue() { }
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
     * @param {?} startX
     * @return {?}
     */
    _onDragStart(startX) {
        (void 0) /* assert */;
        (void 0) /* console.debug */;
        this._zone.run(() => {
            this._startX = startX;
            this._fireFocus();
            this._activated = true;
        });
    }
    /**
     * @hidden
     * @param {?} currentX
     * @return {?}
     */
    _onDragMove(currentX) {
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        let /** @type {?} */ dirty = false;
        let /** @type {?} */ value;
        let /** @type {?} */ activated;
        if (this._value) {
            if (currentX + 15 < this._startX) {
                dirty = true;
                value = false;
                activated = true;
            }
        }
        else if (currentX - 15 > this._startX) {
            dirty = true;
            value = true;
            activated = (currentX < this._startX + 5);
        }
        if (dirty) {
            this._zone.run(() => {
                this.value = value;
                this._startX = currentX;
                this._activated = activated;
                this._haptic.selection();
            });
        }
    }
    /**
     * @hidden
     * @param {?} endX
     * @return {?}
     */
    _onDragEnd(endX) {
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        (void 0) /* console.debug */;
        this._zone.run(() => {
            if (this._value) {
                if (this._startX + 4 > endX) {
                    this.value = false;
                    this._haptic.selection();
                }
            }
            else if (this._startX - 4 < endX) {
                this.value = true;
                this._haptic.selection();
            }
            this._activated = false;
            this._fireBlur();
            this._startX = null;
        });
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    _keyup(ev) {
        if (ev.keyCode === KEY_SPACE || ev.keyCode === KEY_ENTER) {
            (void 0) /* console.debug */;
            ev.preventDefault();
            ev.stopPropagation();
            this.value = !this.value;
        }
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
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._gesture && this._gesture.destroy();
    }
}
Toggle.decorators = [
    { type: Component, args: [{
                selector: 'ion-toggle',
                template: '<div class="toggle-icon">' +
                    '<div class="toggle-inner"></div>' +
                    '</div>' +
                    '<button role="checkbox" ' +
                    'type="button" ' +
                    'ion-button="item-cover" ' +
                    '[id]="id" ' +
                    '[attr.aria-checked]="_value" ' +
                    '[attr.aria-labelledby]="_labelId" ' +
                    '[attr.aria-disabled]="_disabled" ' +
                    'class="item-cover" disable-activated>' +
                    '</button>',
                host: {
                    '[class.toggle-disabled]': '_disabled',
                    '[class.toggle-checked]': '_value',
                    '[class.toggle-activated]': '_activated',
                },
                providers: [TOGGLE_VALUE_ACCESSOR],
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
Toggle.ctorParameters = () => [
    { type: Form, },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Haptic, },
    { type: Item, decorators: [{ type: Optional },] },
    { type: GestureController, },
    { type: DomController, },
    { type: ChangeDetectorRef, },
    { type: NgZone, },
];
Toggle.propDecorators = {
    'checked': [{ type: Input },],
    '_keyup': [{ type: HostListener, args: ['keyup', ['$event'],] },],
};
function Toggle_tsickle_Closure_declarations() {
    /** @type {?} */
    Toggle.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Toggle.ctorParameters;
    /** @type {?} */
    Toggle.propDecorators;
    /** @type {?} */
    Toggle.prototype._activated;
    /** @type {?} */
    Toggle.prototype._startX;
    /** @type {?} */
    Toggle.prototype._msPrv;
    /** @type {?} */
    Toggle.prototype._gesture;
    /** @type {?} */
    Toggle.prototype._plt;
    /** @type {?} */
    Toggle.prototype._haptic;
    /** @type {?} */
    Toggle.prototype._gestureCtrl;
    /** @type {?} */
    Toggle.prototype._domCtrl;
    /** @type {?} */
    Toggle.prototype._cd;
    /** @type {?} */
    Toggle.prototype._zone;
}
//# sourceMappingURL=toggle.js.map