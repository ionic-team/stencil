import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Range } from './range';
import { RangeKnob } from './range-knob';
/**
 * @hidden
 */
export class RangeModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: RangeModule, providers: []
        };
    }
}
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
RangeModule.ctorParameters = () => [];
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