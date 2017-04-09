import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Select } from './select';
/**
 * @hidden
 */
var SelectModule = (function () {
    function SelectModule() {
    }
    /**
     * @return {?}
     */
    SelectModule.forRoot = function () {
        return {
            ngModule: SelectModule, providers: []
        };
    };
    return SelectModule;
}());
export { SelectModule };
SelectModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    Select
                ],
                exports: [
                    Select
                ]
            },] },
];
/**
 * @nocollapse
 */
SelectModule.ctorParameters = function () { return []; };
function SelectModule_tsickle_Closure_declarations() {
    /** @type {?} */
    SelectModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SelectModule.ctorParameters;
}
//# sourceMappingURL=select.module.js.map