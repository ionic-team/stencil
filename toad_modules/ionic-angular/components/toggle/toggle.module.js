import { NgModule } from '@angular/core';
import { Toggle } from './toggle';
/**
 * @hidden
 */
var ToggleModule = (function () {
    function ToggleModule() {
    }
    /**
     * @return {?}
     */
    ToggleModule.forRoot = function () {
        return {
            ngModule: ToggleModule, providers: []
        };
    };
    return ToggleModule;
}());
export { ToggleModule };
ToggleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Toggle
                ],
                exports: [
                    Toggle
                ]
            },] },
];
/**
 * @nocollapse
 */
ToggleModule.ctorParameters = function () { return []; };
function ToggleModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ToggleModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ToggleModule.ctorParameters;
}
//# sourceMappingURL=toggle.module.js.map