import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Range } from './range';
import { RangeKnob } from './range-knob';
/**
 * @hidden
 */
var RangeModule = (function () {
    function RangeModule() {
    }
    /**
     * @return {?}
     */
    RangeModule.forRoot = function () {
        return {
            ngModule: RangeModule, providers: []
        };
    };
    return RangeModule;
}());
export { RangeModule };
RangeModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    Range,
                    RangeKnob
                ],
                exports: [
                    Range,
                    RangeKnob
                ]
            },] },
];
/**
 * @nocollapse
 */
RangeModule.ctorParameters = function () { return []; };
function RangeModule_tsickle_Closure_declarations() {
    /** @type {?} */
    RangeModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RangeModule.ctorParameters;
}
//# sourceMappingURL=range.module.js.map