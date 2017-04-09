import { NgModule } from '@angular/core';
import { Backdrop } from './backdrop';
/**
 * @hidden
 */
export class BackdropModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: BackdropModule, providers: []
        };
    }
}
BackdropModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Backdrop
                ],
                exports: [
                    Backdrop
                ]
            },] },
];
/**
 * @nocollapse
 */
BackdropModule.ctorParameters = () => [];
function BackdropModule_tsickle_Closure_declarations() {
    /** @type {?} */
    BackdropModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BackdropModule.ctorParameters;
}
//# sourceMappingURL=backdrop.module.js.map