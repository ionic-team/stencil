import { NgModule } from '@angular/core';
import { Backdrop } from './backdrop';
/**
 * @hidden
 */
var BackdropModule = (function () {
    function BackdropModule() {
    }
    /**
     * @return {?}
     */
    BackdropModule.forRoot = function () {
        return {
            ngModule: BackdropModule, providers: []
        };
    };
    return BackdropModule;
}());
export { BackdropModule };
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
BackdropModule.ctorParameters = function () { return []; };
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