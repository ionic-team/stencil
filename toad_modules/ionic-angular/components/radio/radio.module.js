import { NgModule } from '@angular/core';
import { RadioButton } from './radio-button';
import { RadioGroup } from './radio-group';
/**
 * @hidden
 */
var RadioModule = (function () {
    function RadioModule() {
    }
    /**
     * @return {?}
     */
    RadioModule.forRoot = function () {
        return {
            ngModule: RadioModule, providers: []
        };
    };
    return RadioModule;
}());
export { RadioModule };
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
RadioModule.ctorParameters = function () { return []; };
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