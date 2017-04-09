import { NgModule } from '@angular/core';
import { Option } from './option';
/**
 * @hidden
 */
export class OptionModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: OptionModule, providers: []
        };
    }
}
OptionModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Option
                ],
                exports: [
                    Option
                ]
            },] },
];
/**
 * @nocollapse
 */
OptionModule.ctorParameters = () => [];
function OptionModule_tsickle_Closure_declarations() {
    /** @type {?} */
    OptionModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    OptionModule.ctorParameters;
}
//# sourceMappingURL=option.module.js.map