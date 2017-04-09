import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Spinner } from './spinner';
/**
 * @hidden
 */
export class SpinnerModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: SpinnerModule, providers: []
        };
    }
}
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
SpinnerModule.ctorParameters = () => [];
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