import { NgModule } from '@angular/core';
import { Scroll } from './scroll';
/**
 * @hidden
 */
var ScrollModule = (function () {
    function ScrollModule() {
    }
    /**
     * @return {?}
     */
    ScrollModule.forRoot = function () {
        return {
            ngModule: ScrollModule, providers: []
        };
    };
    return ScrollModule;
}());
export { ScrollModule };
ScrollModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Scroll
                ],
                exports: [
                    Scroll
                ]
            },] },
];
/**
 * @nocollapse
 */
ScrollModule.ctorParameters = function () { return []; };
function ScrollModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ScrollModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ScrollModule.ctorParameters;
}
//# sourceMappingURL=scroll.module.js.map