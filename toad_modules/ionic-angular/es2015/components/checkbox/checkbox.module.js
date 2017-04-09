import { NgModule } from '@angular/core';
import { Checkbox } from './checkbox';
/**
 * @hidden
 */
export class CheckboxModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: CheckboxModule, providers: []
        };
    }
}
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
CheckboxModule.ctorParameters = () => [];
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