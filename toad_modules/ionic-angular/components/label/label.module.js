import { NgModule } from '@angular/core';
import { Label } from './label';
/**
 * @hidden
 */
var LabelModule = (function () {
    function LabelModule() {
    }
    /**
     * @return {?}
     */
    LabelModule.forRoot = function () {
        return {
            ngModule: LabelModule, providers: []
        };
    };
    return LabelModule;
}());
export { LabelModule };
LabelModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Label
                ],
                exports: [
                    Label
                ]
            },] },
];
/**
 * @nocollapse
 */
LabelModule.ctorParameters = function () { return []; };
function LabelModule_tsickle_Closure_declarations() {
    /** @type {?} */
    LabelModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    LabelModule.ctorParameters;
}
//# sourceMappingURL=label.module.js.map