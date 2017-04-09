import { NgModule } from '@angular/core';
import { Button } from './button';
/**
 * @hidden
 */
var ButtonModule = (function () {
    function ButtonModule() {
    }
    /**
     * @return {?}
     */
    ButtonModule.forRoot = function () {
        return {
            ngModule: ButtonModule, providers: []
        };
    };
    return ButtonModule;
}());
export { ButtonModule };
ButtonModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Button
                ],
                exports: [
                    Button
                ]
            },] },
];
/**
 * @nocollapse
 */
ButtonModule.ctorParameters = function () { return []; };
function ButtonModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ButtonModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ButtonModule.ctorParameters;
}
//# sourceMappingURL=button.module.js.map