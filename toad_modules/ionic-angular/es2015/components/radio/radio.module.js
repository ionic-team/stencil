import { NgModule } from '@angular/core';
import { RadioButton } from './radio-button';
import { RadioGroup } from './radio-group';
/**
 * @hidden
 */
export class RadioModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: RadioModule, providers: []
        };
    }
}
RadioModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    RadioButton,
                    RadioGroup
                ],
                exports: [
                    RadioButton,
                    RadioGroup
                ]
            },] },
];
/**
 * @nocollapse
 */
RadioModule.ctorParameters = () => [];
function RadioModule_tsickle_Closure_declarations() {
    /** @type {?} */
    RadioModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RadioModule.ctorParameters;
}
//# sourceMappingURL=radio.module.js.map