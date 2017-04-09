import { NgModule } from '@angular/core';
import { Option } from './option';
/**
 * @hidden
 */
var OptionModule = (function () {
    function OptionModule() {
    }
    /**
     * @return {?}
     */
    OptionModule.forRoot = function () {
        return {
            ngModule: OptionModule, providers: []
        };
    };
    return OptionModule;
}());
export { OptionModule };
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
OptionModule.ctorParameters = function () { return []; };
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