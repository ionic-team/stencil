import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';
import { GestureController, BLOCK_ALL } from '../../gestures/gesture-controller';
import { Config } from '../../config/config';
import { KEY_ESCAPE } from '../../platform/key';
import { Platform } from '../../platform/platform';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var ActionSheetCmp = (function () {
    /**
     * @param {?} _viewCtrl
     * @param {?} config
     * @param {?} _plt
     * @param {?} _elementRef
     * @param {?} gestureCtrl
     * @param {?} params
     * @param {?} renderer
     */
    function ActionSheetCmp(_viewCtrl, config, _plt, _elementRef, gestureCtrl, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._plt = _plt;
        this._elementRef = _elementRef;
        this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
        this.d = params.data;
        this.mode = config.get('mode');
        renderer.setElementClass(_elementRef.nativeElement, "action-sheet-" + this.mode, true);
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(function (cssClass) {
                // Make sure the class isn't whitespace, otherwise it throws exceptions
                if (cssClass.trim() !== '')
                    renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++actionSheetIds);
        if (this.d.title) {
            this.hdrId = 'acst-hdr-' + this.id;
        }
        if (this.d.subTitle) {
            this.descId = 'acst-subhdr-' + this.id;
        }
    }
    /**
     * @return {?}
     */
    ActionSheetCmp.prototype.ionViewDidLoad = function () {
        var _this = this;
        // normalize the data
        var /** @type {?} */ buttons = [];
        this.d.buttons.forEach(function (button) {
            if (typeof button === 'string') {
                button = { text: button };
            }
            if (!button.cssClass) {
                button.cssClass = '';
            }
            if (button.role === 'cancel') {
                _this.d.cancelButton = button;
            }
            else {
                if (button.role === 'destructive') {
                    button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
                }
                else if (button.role === 'selected') {
                    button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-selected';
                }
                buttons.push(button);
            }
        });
        this.d.buttons = buttons;
    };
    /**
     * @return {?}
     */
    ActionSheetCmp.prototype.ionViewWillEnter = function () {
        this.gestureBlocker.block();
    };
    /**
     * @return {?}
     */
    ActionSheetCmp.prototype.ionViewDidLeave = function () {
        this.gestureBlocker.unblock();
    };
    /**
     * @return {?}
     */
    ActionSheetCmp.prototype.ionViewDidEnter = function () {
        this._plt.focusOutActiveElement();
        var /** @type {?} */ focusableEle = this._elementRef.nativeElement.querySelector('button');
        if (focusableEle) {
            focusableEle.focus();
        }
        this.enabled = true;
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    ActionSheetCmp.prototype.keyUp = function (ev) {
        if (this.enabled && ev.keyCode === KEY_ESCAPE && this._viewCtrl.isLast()) {
            (void 0) /* console.debug */;
            this.bdClick();
        }
    };
    /**
     * @param {?} button
     * @return {?}
     */
    ActionSheetCmp.prototype.click = function (button) {
        if (!this.enabled) {
            return;
        }
        var /** @type {?} */ shouldDismiss = true;
        if (button.handler) {
            // a handler has been provided, execute it
            if (button.handler() === false) {
                // if the return value of the handler is false then do not dismiss
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            this.dismiss(button.role);
        }
    };
    /**
     * @return {?}
     */
    ActionSheetCmp.prototype.bdClick = function () {
        if (this.enabled && this.d.enableBackdropDismiss) {
            if (this.d.cancelButton) {
                this.click(this.d.cancelButton);
            }
            else {
                this.dismiss('backdrop');
            }
        }
    };
    /**
     * @param {?} role
     * @return {?}
     */
    ActionSheetCmp.prototype.dismiss = function (role) {
        var /** @type {?} */ opts = {
            minClickBlockDuration: 400
        };
        return this._viewCtrl.dismiss(null, role, opts);
    };
    /**
     * @return {?}
     */
    ActionSheetCmp.prototype.ngOnDestroy = function () {
        (void 0) /* assert */;
        this.d = null;
        this.gestureBlocker.destroy();
    };
    return ActionSheetCmp;
}());
export { ActionSheetCmp };
ActionSheetCmp.decorators = [
    { type: Component, args: [{
                selector: 'ion-action-sheet',
                template: '<ion-backdrop (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
                    '<div class="action-sheet-wrapper">' +
                    '<div class="action-sheet-container">' +
                    '<div class="action-sheet-group">' +
                    '<div class="action-sheet-title" id="{{hdrId}}" *ngIf="d.title">{{d.title}}</div>' +
                    '<div class="action-sheet-sub-title" id="{{descId}}" *ngIf="d.subTitle">{{d.subTitle}}</div>' +
                    '<button ion-button="action-sheet-button" (click)="click(b)" *ngFor="let b of d.buttons" class="disable-hover" [attr.icon-left]="b.icon ? \'\' : null" [ngClass]="b.cssClass">' +
                    '<ion-icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></ion-icon>' +
                    '{{b.text}}' +
                    '</button>' +
                    '</div>' +
                    '<div class="action-sheet-group" *ngIf="d.cancelButton">' +
                    '<button ion-button="action-sheet-button" (click)="click(d.cancelButton)" class="action-sheet-cancel disable-hover" [attr.icon-left]="d.cancelButton.icon ? \'\' : null" [ngClass]="d.cancelButton.cssClass">' +
                    '<ion-icon [name]="d.cancelButton.icon" *ngIf="d.cancelButton.icon" class="action-sheet-icon"></ion-icon>' +
                    '{{d.cancelButton.text}}' +
                    '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                host: {
                    'role': 'dialog',
                    '[attr.aria-labelledby]': 'hdrId',
                    '[attr.aria-describedby]': 'descId'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
ActionSheetCmp.ctorParameters = function () { return [
    { type: ViewController, },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: GestureController, },
    { type: NavParams, },
    { type: Renderer, },
]; };
ActionSheetCmp.propDecorators = {
    'keyUp': [{ type: HostListener, args: ['body:keyup', ['$event'],] },],
};
function ActionSheetCmp_tsickle_Closure_declarations() {
    /** @type {?} */
    ActionSheetCmp.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ActionSheetCmp.ctorParameters;
    /** @type {?} */
    ActionSheetCmp.propDecorators;
    /** @type {?} */
    ActionSheetCmp.prototype.d;
    /** @type {?} */
    ActionSheetCmp.prototype.descId;
    /** @type {?} */
    ActionSheetCmp.prototype.enabled;
    /** @type {?} */
    ActionSheetCmp.prototype.hdrId;
    /** @type {?} */
    ActionSheetCmp.prototype.id;
    /** @type {?} */
    ActionSheetCmp.prototype.mode;
    /** @type {?} */
    ActionSheetCmp.prototype.gestureBlocker;
    /** @type {?} */
    ActionSheetCmp.prototype._viewCtrl;
    /** @type {?} */
    ActionSheetCmp.prototype._plt;
    /** @type {?} */
    ActionSheetCmp.prototype._elementRef;
}
var /** @type {?} */ actionSheetIds = -1;
//# sourceMappingURL=action-sheet-component.js.map