import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Select } from './select';
/**
 * @hidden
 */
export class SelectModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: SelectModule, providers: []
        };
    }
}
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
SelectModule.ctorParameters = () => [];
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