import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Spinner } from './spinner';
/**
 * @hidden
 */
var SpinnerModule = (function () {
    function SpinnerModule() {
    }
    /**
     * @return {?}
     */
    SpinnerModule.forRoot = function () {
        return {
            ngModule: SpinnerModule, providers: []
        };
    };
    return SpinnerModule;
}());
export { SpinnerModule };
SpinnerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    Spinner
                ],
                exports: [
                    Spinner
                ]
            },] },
];
/**
 * @nocollapse
 */
SpinnerModule.ctorParameters = function () { return []; };
function SpinnerModule_tsickle_Closure_declarations() {
    /** @type {?} */
    SpinnerModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SpinnerModule.ctorParameters;
}
//# sourceMappingURL=spinner.module.js.map