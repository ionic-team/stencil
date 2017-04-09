import { Component, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { GestureController, BLOCK_ALL } from '../../gestures/gesture-controller';
import { isDefined, isUndefined } from '../../util/util';
import { NavParams } from '../../navigation/nav-params';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var LoadingCmp = (function () {
    /**
     * @param {?} _viewCtrl
     * @param {?} _config
     * @param {?} _plt
     * @param {?} _elementRef
     * @param {?} gestureCtrl
     * @param {?} params
     * @param {?} renderer
     */
    function LoadingCmp(_viewCtrl, _config, _plt, _elementRef, gestureCtrl, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._config = _config;
        this._plt = _plt;
        this._elementRef = _elementRef;
        (void 0) /* assert */;
        this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
        this.d = params.data;
        renderer.setElementClass(_elementRef.nativeElement, "loading-" + _config.get('mode'), true);
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(function (cssClass) {
                // Make sure the class isn't whitespace, otherwise it throws exceptions
                if (cssClass.trim() !== '')
                    renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++loadingIds);
    }
    /**
     * @return {?}
     */
    LoadingCmp.prototype.ngOnInit = function () {
        // If no spinner was passed in loading options we need to fall back
        // to the loadingSpinner in the app's config, then the mode spinner
        if (isUndefined(this.d.spinner)) {
            this.d.spinner = this._config.get('loadingSpinner', this._config.get('spinner', 'ios'));
        }
        // If the user passed hide to the spinner we don't want to show it
        this.showSpinner = isDefined(this.d.spinner) && this.d.spinner !== 'hide';
    };
    /**
     * @return {?}
     */
    LoadingCmp.prototype.ionViewWillEnter = function () {
        this.gestureBlocker.block();
    };
    /**
     * @return {?}
     */
    LoadingCmp.prototype.ionViewDidLeave = function () {
        this.gestureBlocker.unblock();
    };
    /**
     * @return {?}
     */
    LoadingCmp.prototype.ionViewDidEnter = function () {
        var _this = this;
        this._plt.focusOutActiveElement();
        // If there is a duration, dismiss after that amount of time
        if (this.d && this.d.duration) {
            this.durationTimeout = setTimeout(function () { return _this.dismiss('backdrop'); }, this.d.duration);
        }
    };
    /**
     * @param {?} role
     * @return {?}
     */
    LoadingCmp.prototype.dismiss = function (role) {
        if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
        }
        return this._viewCtrl.dismiss(null, role);
    };
    /**
     * @return {?}
     */
    LoadingCmp.prototype.ngOnDestroy = function () {
        (void 0) /* assert */;
        this.gestureBlocker.destroy();
    };
    return LoadingCmp;
}());
export { LoadingCmp };
LoadingCmp.decorators = [
    { type: Component, args: [{
                selector: 'ion-loading',
                template: '<ion-backdrop [hidden]="!d.showBackdrop"></ion-backdrop>' +
                    '<div class="loading-wrapper">' +
                    '<div *ngIf="showSpinner" class="loading-spinner">' +
                    '<ion-spinner [name]="d.spinner"></ion-spinner>' +
                    '</div>' +
                    '<div *ngIf="d.content" [innerHTML]="d.content" class="loading-content"></div>' +
                    '</div>',
                host: {
                    'role': 'dialog'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
LoadingCmp.ctorParameters = function () { return [
    { type: ViewController, },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: GestureController, },
    { type: NavParams, },
    { type: Renderer, },
]; };
function LoadingCmp_tsickle_Closure_declarations() {
    /** @type {?} */
    LoadingCmp.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    LoadingCmp.ctorParameters;
    /** @type {?} */
    LoadingCmp.prototype.d;
    /** @type {?} */
    LoadingCmp.prototype.id;
    /** @type {?} */
    LoadingCmp.prototype.showSpinner;
    /** @type {?} */
    LoadingCmp.prototype.durationTimeout;
    /** @type {?} */
    LoadingCmp.prototype.gestureBlocker;
    /** @type {?} */
    LoadingCmp.prototype._viewCtrl;
    /** @type {?} */
    LoadingCmp.prototype._config;
    /** @type {?} */
    LoadingCmp.prototype._plt;
    /** @type {?} */
    LoadingCmp.prototype._elementRef;
}
var /** @type {?} */ loadingIds = -1;
//# sourceMappingURL=loading-component.js.map