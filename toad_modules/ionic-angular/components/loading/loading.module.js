import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { LoadingCmp } from './loading-component';
/**
 * @hidden
 */
var LoadingModule = (function () {
    function LoadingModule() {
    }
    /**
     * @return {?}
     */
    LoadingModule.forRoot = function () {
        return {
            ngModule: LoadingModule, providers: []
        };
    };
    return LoadingModule;
}());
export { LoadingModule };
LoadingModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule,
                    CommonModule,
                    SpinnerModule
                ],
                declarations: [
                    LoadingCmp
                ],
                exports: [
                    LoadingCmp
                ],
                entryComponents: [
                    LoadingCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
LoadingModule.ctorParameters = function () { return []; };
function LoadingModule_tsickle_Closure_declarations() {
    /** @type {?} */
    LoadingModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    LoadingModule.ctorParameters;
}
//# sourceMappingURL=loading.module.js.map