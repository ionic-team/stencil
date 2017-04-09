import { NgModule } from '@angular/core';
import { Checkbox } from './checkbox';
/**
 * @hidden
 */
var CheckboxModule = (function () {
    function CheckboxModule() {
    }
    /**
     * @return {?}
     */
    CheckboxModule.forRoot = function () {
        return {
            ngModule: CheckboxModule, providers: []
        };
    };
    return CheckboxModule;
}());
export { CheckboxModule };
CheckboxModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Checkbox
                ],
                exports: [
                    Checkbox
                ]
            },] },
];
/**
 * @nocollapse
 */
CheckboxModule.ctorParameters = function () { return []; };
function CheckboxModule_tsickle_Closure_declarations() {
    /** @type {?} */
    CheckboxModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CheckboxModule.ctorParameters;
}
//# sourceMappingURL=checkbox.module.js.map