import { NgModule } from '@angular/core';
import { ShowWhen } from './show-when';
import { HideWhen } from './hide-when';
/**
 * @hidden
 */
var ShowHideWhenModule = (function () {
    function ShowHideWhenModule() {
    }
    /**
     * @return {?}
     */
    ShowHideWhenModule.forRoot = function () {
        return {
            ngModule: ShowHideWhenModule, providers: []
        };
    };
    return ShowHideWhenModule;
}());
export { ShowHideWhenModule };
ShowHideWhenModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ShowWhen,
                    HideWhen
                ],
                exports: [
                    ShowWhen,
                    HideWhen
                ]
            },] },
];
/**
 * @nocollapse
 */
ShowHideWhenModule.ctorParameters = function () { return []; };
function ShowHideWhenModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ShowHideWhenModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ShowHideWhenModule.ctorParameters;
}
//# sourceMappingURL=show-hide-when.module.js.map