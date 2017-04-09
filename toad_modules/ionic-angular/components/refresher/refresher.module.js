import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { Refresher } from './refresher';
import { RefresherContent } from './refresher-content';
/**
 * @hidden
 */
var RefresherModule = (function () {
    function RefresherModule() {
    }
    /**
     * @return {?}
     */
    RefresherModule.forRoot = function () {
        return {
            ngModule: RefresherModule, providers: []
        };
    };
    return RefresherModule;
}());
export { RefresherModule };
RefresherModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    IconModule,
                    SpinnerModule
                ],
                declarations: [
                    Refresher,
                    RefresherContent
                ],
                exports: [
                    Refresher,
                    RefresherContent
                ]
            },] },
];
/**
 * @nocollapse
 */
RefresherModule.ctorParameters = function () { return []; };
function RefresherModule_tsickle_Closure_declarations() {
    /** @type {?} */
    RefresherModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RefresherModule.ctorParameters;
}
//# sourceMappingURL=refresher.module.js.map