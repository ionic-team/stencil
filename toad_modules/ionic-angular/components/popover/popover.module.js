import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { PopoverCmp } from './popover-component';
/**
 * @hidden
 */
var PopoverModule = (function () {
    function PopoverModule() {
    }
    /**
     * @return {?}
     */
    PopoverModule.forRoot = function () {
        return {
            ngModule: PopoverModule, providers: []
        };
    };
    return PopoverModule;
}());
export { PopoverModule };
PopoverModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BackdropModule
                ],
                declarations: [
                    PopoverCmp
                ],
                exports: [
                    PopoverCmp
                ],
                entryComponents: [
                    PopoverCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
PopoverModule.ctorParameters = function () { return []; };
function PopoverModule_tsickle_Closure_declarations() {
    /** @type {?} */
    PopoverModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PopoverModule.ctorParameters;
}
//# sourceMappingURL=popover.module.js.map