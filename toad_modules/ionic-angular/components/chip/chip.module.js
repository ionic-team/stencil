import { NgModule } from '@angular/core';
import { Chip } from './chip';
/**
 * @hidden
 */
var ChipModule = (function () {
    function ChipModule() {
    }
    /**
     * @return {?}
     */
    ChipModule.forRoot = function () {
        return {
            ngModule: ChipModule, providers: []
        };
    };
    return ChipModule;
}());
export { ChipModule };
ChipModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Chip
                ],
                exports: [
                    Chip
                ]
            },] },
];
/**
 * @nocollapse
 */
ChipModule.ctorParameters = function () { return []; };
function ChipModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ChipModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ChipModule.ctorParameters;
}
//# sourceMappingURL=chip.module.js.map